import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';
import Dropdown from '../../common/components/dropdown';
import Clickable from '../../common/components/clickable';
import {
	BID_SHARES,
	ASK_SHARES
} from '../../../modules/transactions/constants/types';

const TradePanelBody = (p) => {
	const itemRows = (outcomes, sideOptions) => {
		let tableRows = [];

		outcomes.map((outcome) => {
			const orderBookMaxRows = outcome.orderBook.bids.length > outcome.orderBook.asks.length ? new Array(outcome.orderBook.bids.length) : new Array(outcome.orderBook.asks.length);
			orderBookMaxRows.fill('');

			tableRows.push(
				<tr
					key={`${outcome.name}`}
					className={classnames('trade-panel-row', 'clickable-row')}
					onClick={event => {
						event.stopPropagation();

						p.updateSelectedOutcome(outcome.id);
					}}
				>
					<th className="outcome-name">
						{outcome.name}
					</th>
					<td className="last-price">
						<ValueDenomination {...outcome.lastPrice} />
					</td>
					<td className='bid'>
						<Clickable onClick={() => {outcome.trade.updateTradeOrder(outcome.id, outcome.topBid.shares.value, outcome.topBid.price.value, ASK_SHARES); }} >
							<ValueDenomination className="top-bid" {...outcome.topBid.shares} />
						</Clickable>
						<span className="shares-at">@</span>
						<Clickable onClick={() => {outcome.trade.updateTradeOrder(outcome.id, undefined, outcome.topBid.price.value); }}>
							<ValueDenomination className="top-bid" {...outcome.topBid.price} />
						</Clickable>
					</td>
					<td className='ask'>
						<Clickable onClick={() => {outcome.trade.updateTradeOrder(outcome.id, undefined, outcome.topAsk.price.value); }}>
							<ValueDenomination className="top-ask" {...outcome.topAsk.price} />
						</Clickable>
						<span className="shares-at">@</span>
						<Clickable onClick={() => {outcome.trade.updateTradeOrder(outcome.id, outcome.topAsk.shares.value, outcome.topAsk.price.value, BID_SHARES); }} >
							<ValueDenomination className="top-ask" {...outcome.topAsk.shares} />
						</Clickable>
					</td>

					<td>
						<Dropdown
							selected={sideOptions.find(opt => opt.value == outcome.trade.side)}
							options={sideOptions}
							onChange={(selectedOption) => { outcome.trade.updateTradeOrder(outcome.id, undefined, undefined, selectedOption); }}
						/>
					</td>
					<td>
						<Input
							className="num-shares"
							type="text"
							value={outcome.trade.numShares}
							isClearable={false}
							onChange={(value) => outcome.trade.updateTradeOrder(outcome.id, parseFloat(value) || 0, undefined)}
						/>
					</td>
					<td>
						<Input
							className="limit-price"
							type="text"
							value={outcome.trade.limitPrice}
							isClearable={false}
							onChange={(value) => outcome.trade.updateTradeOrder(outcome.id, undefined, parseFloat(value) || 0)}
						/>
					</td>
					<td className="fee-to-pay" >
						<ValueDenomination {...outcome.trade.feeToPay} />
					</td>
					<td className="total-cost" >
						<ValueDenomination {...outcome.trade.profitLoss} />
					</td>
				</tr>
			);

			orderBookMaxRows.map((cV, i) => {
				if(i != 0){
					tableRows.push(
						<tr
							key={`${outcome.name}-order-book-${i}`}
							className={classnames('trade-panel-row', {'displayNone': p.selectedOutcomeID === outcome.id ? false : true})}
						>
							<td colSpan="2"></td>
							<td>
								{ outcome.orderBook.bids[i] &&
									<div className='order-book-data bid'>
										<Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, outcome.orderBook.bids[i].shares.value, outcome.orderBook.bids[i].price.value, ASK_SHARES);
										}} >
											<ValueDenomination className="shares" {...outcome.orderBook.bids[i].shares} />
										</Clickable>
										<span className="shares-at">@</span>
										<Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, undefined, outcome.orderBook.bids[i].price.value);
										}}>
											<ValueDenomination className="price" {...outcome.orderBook.bids[i].price} />
										</Clickable>
									</div>
								}
							</td>
							<td>
								{ outcome.orderBook.asks[i] &&
									<div className='order-book-data ask'>
										<Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, undefined, outcome.orderBook.asks[i].price.value);
										}} >
											<ValueDenomination className="price" {...outcome.orderBook.asks[i].price} />
										</Clickable>
										<span className="shares-at">@</span>
										<Clickable onClick={event => {
											event.stopPropagation();

											outcome.trade.updateTradeOrder(outcome.id, outcome.orderBook.asks[i].shares.value, outcome.orderBook.asks[i].price.value, BID_SHARES);
										}} >
											<ValueDenomination className="shares" {...outcome.orderBook.asks[i].shares} />
										</Clickable>
									</div>
								}
							</td>
							<td colSpan="5"></td>
						</tr>
					)
				}
			});
		});

		return tableRows;
	};

	return (
		<tbody className="trade-panel-body">
			{itemRows(p.outcomes, p.sideOptions)}
		</tbody>
	);
};

TradePanelBody.propTypes = {
	outcomes: React.PropTypes.array,
	sideOptions: React.PropTypes.array,
	selectedOutcomeID: React.PropTypes.string,
	updateSelectedOutcome: React.PropTypes.func
};

export default TradePanelBody;
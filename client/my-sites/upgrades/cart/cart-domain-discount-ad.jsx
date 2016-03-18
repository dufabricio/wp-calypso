/**
 * External dependencies
 */
import { connect } from 'react-redux';
import find from 'lodash/find';
import React from 'react';

/**
 * Internal dependencies
 */
import CartAd from './cart-ad';
import { cartItems } from 'lib/cart-values';
import { fetchSitePlans } from 'state/sites/plans/actions';
import { getPlansBySite } from 'state/sites/plans/selectors';
import { isBusiness, isPlan, isPremium } from 'lib/products-values';
import i18n from 'lib/mixins/i18n';
import { shouldFetchSitePlans } from 'lib/plans';

const CartDomainDiscountAd = React.createClass( {
	propTypes: {
		cart: React.PropTypes.object,
		sitePlans: React.PropTypes.object
	},

	componentDidMount() {
		this.props.fetchSitePlans( this.props.sitePlans, this.props.selectedSite );
	},

	render() {
		const { cart, sitePlans } = this.props;
		let plan;

		if ( ! sitePlans.hasLoadedFromServer || ! cart.hasLoadedFromServer || ! cartItems.getAll( cart ).some( isPlan ) ) {
			return null;
		}

		if ( cartItems.getAll( cart ).some( isPremium ) ) {
			plan = find( sitePlans.data, isPremium );
		}

		if ( cartItems.getAll( cart ).some( isBusiness ) ) {
			plan = find( sitePlans.data, isBusiness );
		}

		if ( plan.rawDiscount === 0 ) {
			return null;
		}

		return (
			<CartAd>
				{
					i18n.translate(
						"{{strong}}You're saving %(discount)s!{{/strong}} Your recent domain purchase is " +
						'deducted from the price (%(fullPrice)s), since the plan includes a free domain.', {
							args: { discount: plan.formattedDiscount, fullPrice: plan.formattedPrice },
							components: { strong: <strong /> }
						}
					)
				}
			</CartAd>
		);
	}
} );

export default connect(
	( state, { selectedSite } ) => {
		return {
			sitePlans: getPlansBySite( state, selectedSite )
		}
	},
	( dispatch ) => {
		return {
			fetchSitePlans: ( sitePlans, site ) => {
				if ( shouldFetchSitePlans( sitePlans, site ) ) {
					dispatch( fetchSitePlans( site.ID ) );
				}
			}
		}
	}
)( CartDomainDiscountAd );

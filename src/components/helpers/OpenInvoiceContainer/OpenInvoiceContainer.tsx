import { h } from 'preact';
import UIElement from '../../UIElement';
import OpenInvoice from '../../internal/OpenInvoice';
import CoreProvider from '../../../core/Context/CoreProvider';
import { unformatDate } from '../../internal/FormFields/InputDate/utils';

export default class OpenInvoiceContainer extends UIElement {
    protected static defaultProps = {
        onChange: () => {},
        data: { personalDetails: {}, billingAddress: {}, deliveryAddress: {} },
        visibility: {
            personalDetails: 'editable',
            billingAddress: 'editable',
            deliveryAddress: 'editable'
        }
    };

    /**
     * Returns whether the component state is valid or not
     */
    get isValid() {
        return !!this.state.isValid;
    }

    /**
     * Formats props on construction time
     */
    formatProps(props) {
        return {
            ...props,
            data: {
                ...props.data,
                billingAddress: {
                    ...props.data.billingAddress,
                    country: props.countryCode || props.data.billingAddress.countryCode
                },
                deliveryAddress: {
                    ...props.data.deliveryAddress,
                    country: props.countryCode || props.data.deliveryAddress.countryCode
                }
            }
        };
    }

    /**
     * Formats the component data output
     */
    formatData() {
        const { data = {} } = this.state;
        const { personalDetails = {}, billingAddress, deliveryAddress } = data;
        const { firstName, lastName, gender = 'UNKNOWN', telephoneNumber, shopperEmail, dateOfBirth } = personalDetails;

        return {
            paymentMethod: {
                type: this.constructor['type']
            },
            shopperName: { firstName, lastName, gender },
            dateOfBirth: unformatDate(dateOfBirth),
            telephoneNumber,
            shopperEmail,
            billingAddress,
            deliveryAddress: deliveryAddress || billingAddress,
            countryCode: billingAddress?.country
        };
    }

    render() {
        return (
            <CoreProvider i18n={this.props.i18n} loadingContext={this.props.loadingContext}>
                <OpenInvoice
                    ref={ref => {
                        this.componentRef = ref;
                    }}
                    {...this.props}
                    {...this.state}
                    consentCheckbox={this.props.consentCheckbox}
                    onChange={this.setState}
                    onSubmit={this.submit}
                    payButton={this.payButton}
                />
            </CoreProvider>
        );
    }
}

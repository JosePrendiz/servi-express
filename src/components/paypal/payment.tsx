import React, { useEffect } from 'react';
import { loadScript, PayPalNamespace, PayPalScriptQueryParameters } from '@paypal/paypal-js';
import { PayPalPaymentProps } from 'app/interfaces';

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ amount, quotationId }) => {
    useEffect(() => {
        const initializePayPal = async () => {
            const options: PayPalScriptQueryParameters = {
                clientId: 'AXDrgxgmUh5bz2ax93GbvjjFjfaIbybwVYWuznIZ2EOr2nG3BbVvLZJe8i21qHewoYhae2ReETKDjQ0p',
            };
            try {
                const paypal: PayPalNamespace | null = await loadScript(options);

                if (!paypal) {
                    console.error('PayPal SDK failed to load.');
                    return;
                }

                if (paypal.Buttons) {
                    paypal.Buttons({
                        createOrder: (data, actions) => {
                            return actions.order.create({
                                intent: 'CAPTURE',
                                purchase_units: [
                                    {
                                        amount: {
                                            value: amount,
                                            currency_code: 'USD',
                                        },
                                        custom_id: quotationId,
                                    },
                                ],
                            });
                        },
                        onApprove: (data, actions) => {
                            if (!actions?.order) {
                                console.error('Order actions are undefined.');
                                return Promise.reject(new Error('Order actions are undefined.'));
                            }

                            return actions.order.capture().then((details) => {
                                alert('Pago completado por: ' + details?.payer?.name?.given_name);
                                console.log('Detalles del Pago:', details);
                            });
                        },
                        onError: (err: Record<string, unknown>) => {
                            console.error('Error en el Pago:', err);
                        },
                    }).render('#paypal-button-container');
                } else {
                    console.error('PayPal Buttons is undefined.');
                }
            } catch (error) {
                console.error('Error loading PayPal SDK:', error);
            }
        };

        initializePayPal();
    }, [amount, quotationId]);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Pagar con PayPal</h1>
            <div id="paypal-button-container"></div>
        </div>
    );
};

export default PayPalPayment;

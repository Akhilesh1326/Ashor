// dummy business logic for the order example, each step takes ~3 seconds

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function checkPayment(input: { orderId: string, amount: number }) {
    console.log(`[checkPayment] verifying payment of ${input.amount} for order ${input.orderId}`);
    await sleep(3000);
    console.log(`[checkPayment] payment approved for order ${input.orderId}`);

    return { orderId: input.orderId, paymentId: `pay_${Date.now()}`, status: 'approved' };
}

export async function reserveInventory(input: { orderId: string, items: string[] }) {
    console.log(`[reserveInventory] reserving ${input.items.length} item(s) for order ${input.orderId}`);
    await sleep(3000);
    console.log(`[reserveInventory] items reserved for order ${input.orderId}`);

    return { orderId: input.orderId, reservationId: `res_${Date.now()}`, items: input.items };
}

export async function createShipment(input: { orderId: string, address: string }) {
    console.log(`[createShipment] creating shipment to ${input.address} for order ${input.orderId}`);
    await sleep(3000);
    console.log(`[createShipment] shipment created for order ${input.orderId}`);

    return { orderId: input.orderId, trackingId: `trk_${Date.now()}`, status: 'shipped' };
}

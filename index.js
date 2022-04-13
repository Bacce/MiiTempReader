const { createBluetooth } = require('node-ble');
const { bluetooth, destroy } = createBluetooth();
let device;

(async () => {
    const serviceUUID = "ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6";
    const characteristicUUID = "ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6";
    const adapter = await bluetooth.defaultAdapter();

    console.log("Loading device...");
    device = await adapter.waitDevice('A4:C1:38:FB:3B:F6'); // Change this ID to your sensors
    console.log("Initializing connection...");
    try {
        await device.connect();
        console.log("Creating GATT server...");
        const gattServer = await device.gatt();
        console.log("Loading services...");
        const service = await gattServer.getPrimaryService(serviceUUID);
        console.log("Loading characteristic...");
        const characteristic = await service.getCharacteristic(characteristicUUID);
        console.log("Subscribing to notifications...");
        await characteristic.startNotifications();
        console.log("Ready!");
        console.log("-------------");
        characteristic.on('valuechanged', event => {
            // Decrypt stolen from https://atc1441.github.io/TelinkFlasher.html
            var buffer = toArrayBuffer(event);
            var value = new DataView(buffer);
            var sign = value.getUint8(1) & (1 << 7);
            var temp = ((value.getUint8(1) & 0x7F) << 8 | value.getUint8(0));
            if (sign) temp = temp - 32767;
            temp = temp / 100;
            var hum = value.getUint8(2);
            var output = "Temperature: " + temp + "°C      Humidity: " + hum + "%";
            console.log(output);
        });
    }
    catch (e) {
        console.log("Error: ", e);
        console.log("Please try again.");
        process.exit();
    }
})();

const toArrayBuffer = (buf) => {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}


process.on('SIGINT', async () => {
    if (device) {
        let isconnected = await device.isConnected();
        if (isconnected) {
            console.log("Disconnecting from device...");
            await device.disconnect();
            destroy();
        }
    }
    console.log("Good bye");
    process.exit();
});


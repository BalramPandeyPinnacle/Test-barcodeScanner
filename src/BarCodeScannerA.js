import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScannerA = () => {
  const [result, setResult] = useState("");
  const qrRef = useRef(null);
  const scannerRef = useRef(null);

  const onScanSuccess = (decodedText, decodedResult) => {
    setResult(decodedText);
    // Optionally, stop scanning after first successful scan.
    scannerRef.current.stop();
  };

  const onScanError = (error) => {
    console.log(`QR Error: ${error}`);
  };

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const cameraConfig = {
      facingMode: "environment",
      // Specify the preference for autofocus feature in the camera config.
      // Note: The actual availability of autofocus depends on the device and browser.
      aspectRatio: 1.777777778
    };

    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length) {
        const cameraId = cameras.find(camera => camera.label.includes('back'))?.id || cameras[0].id;
        // Start scanning with the selected camera.
        scannerRef.current = new Html5Qrcode(qrRef.current.id);
        scannerRef.current.start(cameraId, config, onScanSuccess, onScanError)
          .catch(err => console.log(`Error starting scanner: ${err}`));
      }
    }).catch(err => console.log(`Error fetching cameras: ${err}`));

    return () => {
      scannerRef.current?.stop().then(() => {
        console.log("Scanner stopped");
      }).catch((err) => {
        console.log(`Error stopping scanner: ${err}`);
      });
    };
  }, []);

  return (
    <div>
      <div>{result || "Nothing here"}</div>
      <div id="qr-reader" ref={qrRef} style={{ width: "500px", height: "500px" }}>
        Barcode Scanner
      </div>
    </div>
  );
};

export default BarcodeScannerA;
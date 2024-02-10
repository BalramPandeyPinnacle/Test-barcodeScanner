import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeError, Html5QrcodeResult } from "html5-qrcode/esm/core";

const BarcodeScanner = () => {
  const barcodeScannerContainer = useRef(null);
  const barcodeScanner = useRef(null);
  const [result, setResult] = useState("");

  const onScanSuccess = (decodedText, result) => {
    setResult(decodedText);
  };

  const onScanError = (errorMessage, error) => {
    // Handle scan error
  };

  useEffect(() => {
    barcodeScanner.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250
      },
      true
    );
    barcodeScanner.current.render(onScanSuccess, onScanError);

    return () => {
      barcodeScanner.current.clear();
    };
  }, []);

  return (
    <div>
      <div>{result || "Nothing here"}</div>
      <div id="qr-reader" ref={barcodeScannerContainer}>
        Barcode Scanner
      </div>
    </div>
  );
};

export default BarcodeScanner;
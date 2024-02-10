import * as SDCCore from 'scandit-web-datacapture-core';
import * as SDCBarcode from 'scandit-web-datacapture-barcode';
import { useEffect } from 'react';

const licenseKey = "AfHkHGFKRbwJD5nD9CuWn3I14pFUOfSbU1h6qLludGWOcCg39z8QFZdLqvUBOEfTEG+1hI0IdTNvQPdlUiY34udSWzxHHsXFhRA1dRNBo18xICCVN0jj+bRpcJ58XrYd1hRjYxstA2AUTUe+fmLM5tspRM0IA0wKogOeK6NM0NU0WQXY50jBbkNpy150U8t0KjPu33x9/xDMBoFaRXMEgIMwol5NchV+ljye/D1jscrfYB95lEn4MYVQjhA3fr6y3VFuDxQrgu9KZSef0UCO2r1ByV5xSNWjOi7aG+BQTyPrL+jyEXcHUzxxt1yMUd4MQ0mygPxnUTlsSYPYjmV+QrRacgQqZi7Yc1MtXXJPqXlDcdpKPXkwaktAXFz1bZwchC6BmpV9gqZWJff05nfLMZB8DzRYM3T+i3bLzOxfWEgne9fAumwLWMdG4BmgVvWsCW7ZzrxCKmHwTrZM3XdsCYd0yOcPXSHiNFcFn7B9Zm5zYMOhemUVxvRqHs4ZRUnjvAlfjrFCxZpAXjkHC25yaxQPyNP0Y2O2X1aWRJEzd3n4BlY4bOBl6k9gzrFcwGtnSMWxpFmopwFTrqRbfzim7uC9s8Ih5D5GBgF30SDSAdP4twGYJZGKSEML+fAd+kgtK1sAY227a1Xe2vww1iUiA2908C9qfO3sHA5f2QRbIZpGOxpf02wuSMrhAddOASONfFf0+H97wp5Wzvm/hZ+H4mTy/LUypaRy701gHdQlEXUR1d6w38hD6tuIuweiuq3x/r3OUP1ABHfs9CVBLH6HLEQqZ83b2Dx0QnqbzsV2RrNGIdJQFhtnLr/Q5HUKdCFOlUSHk2EN1KP/p/VOnZ2/mg7+dHoshz8pv7V5p0M4Ihi+fDBPurF2igSr1QpPwE4XVga0IPIyOZ1PtP5a7isOIS/qhlGz9F8C5Tl/qtJYchFWwbvWpv10oy89JNLmaOflrPVCAHvg+3Y0c665M1JGmUgahBb672ILIjNLsv0mYvsg1ipYoqMUbj+a07q8D3MvAKo1rdOmmX+/qSmI4ECKk+tbb4mCVOaWFSA6rXTFtbQ1/NUBqk6Cww1tJA2WBCiq2bJXXd1oEQIvPwlXImnJEi3T5QdcVQRUBPzwNvvDBwDjY+e7e7/t+AwaPIf0ZadjwoJ4Pc8tKTd4YBol+hFICCpLEpJgmFLZHBrbQEUdw/RG0yEtIwvkiovTE3R+s4nA7IK4pysxoJGqkIayU00QXqjM";

 const Scanner = () => {
   useEffect(() => {
     async function runScanner() {
       await SDCCore.configure({
       licenseKey: licenseKey,
       libraryLocation: process.env.PUBLIC_URL + '/engine',
       moduleLoaders: [SDCBarcode.barcodeCaptureLoader()]
     });

     const context = await SDCCore.DataCaptureContext.create();

     const camera = SDCCore.Camera.default;
     await context.setFrameSource(camera);

     const settings = new SDCBarcode.BarcodeCaptureSettings();
     settings.enableSymbologies([
       SDCBarcode.Symbology.Code128,
       SDCBarcode.Symbology.Code39,
       SDCBarcode.Symbology.QR,
       SDCBarcode.Symbology.EAN8,
       SDCBarcode.Symbology.UPCE,
       SDCBarcode.Symbology.EAN13UPCA
     ]);

     const symbologySetting = settings.settingsForSymbology(SDCBarcode.Symbology.Code39);
     symbologySetting.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

     const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, settings);
     await barcodeCapture.setEnabled(false);

     barcodeCapture.addListener({
       didScan: async (barcodeCapture, session) => {
         await barcodeCapture.setEnabled(false);
         const barcode = session.newlyRecognizedBarcodes[0];
         const symbology = new SDCBarcode.SymbologyDescription(barcode.symbology);
         showResult(barcode.data, symbology.readableName);
         await barcodeCapture.setEnabled(true);
       },
     });

     const view = await SDCCore.DataCaptureView.forContext(context);
     view.connectToElement(document.getElementById("data-capture-view"));
     view.addControl(new SDCCore.CameraSwitchControl()); 

     const barcodeCaptureOverlay = 
       await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
       barcodeCapture,
       view,
       SDCBarcode.BarcodeCaptureOverlayStyle.Frame
     );

     const viewfinder = new SDCCore.RectangularViewfinder(
       SDCCore.RectangularViewfinderStyle.Square,
       SDCCore.RectangularViewfinderLineStyle.Light
     );

     await barcodeCaptureOverlay.setViewfinder(viewfinder); 

     await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
     await barcodeCapture.setEnabled(true);
  }

  function showResult(data, symbology) {
    alert("Scanned: "+data+" "+symbology);
  }

  runScanner().catch((error) => {
    console.error(error);
    alert(error);
    });
  }, []);

  return(
    <div id="data-capture-view"></div>
  )

};

export default Scanner;
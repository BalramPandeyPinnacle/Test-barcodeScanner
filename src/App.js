import {BrowserRouter, Routes, Route} from "react-router-dom";
import BarcodeScanner from "./BarCodeScanner";
import BScanner from "./BScanner";
import BarcodeScannerA from "./BarCodeScannerA";
import Home from "./Home";


function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={< Home />} />
    <Route path="/a" element={< BarcodeScanner />} />
    <Route path="/b" element={< BScanner/>} />
    <Route path="/c" element={< BarcodeScannerA/>} />
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
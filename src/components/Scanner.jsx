import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Scanner = ({ onScanSuccess, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScan = (decodedText) => {
      onScanSuccess(decodedText);
      scanner.clear();
      onClose();
    };

    const onError = (error) => {
      console.warn("QR Error:", error);
    };

    scanner.render(onScan, onError);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, [onScanSuccess, onClose]);

  return (
    <div style={{ position: 'relative' }}>
        <button onClick={onClose} className="btn btn-secondary" style={{ position: 'absolute', top: '-40px', right: 0, zIndex: 1000}}>Cerrar Escáner</button>
        <div id="reader" width="100%"></div>
    </div>
  );
};

export default Scanner;

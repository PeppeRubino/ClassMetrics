import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const DownloadPDFButton = ({ targetRef, fileName = "documento" }) => {
  const [showFooter, setShowFooter] = useState(false);

  const downloadPDF = async () => {
    if (!targetRef.current) return;

    setShowFooter(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = targetRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;

    if (imgHeight <= pageHeight - 5) {
      pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth - 20, imgHeight + 30);
    } else {
      let heightLeft = imgHeight;
      let position = 10;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 10, position, imgWidth - 20, imgHeight);
        heightLeft -= pageHeight - 20;
        if (heightLeft > 0) {
          pdf.addPage();
          position = 10;
        }
      }
    }

    pdf.save(`${fileName}.pdf`);
    setShowFooter(false);
  };

  return (
    <>
      <button
        onClick={downloadPDF}
        style={{
          background: 'var(--accent)',
          color: 'var(--accent-fg)',
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius)',
          marginTop: '1rem',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'opacity 0.2s',
          position: 'absolute',
          right: '-4px',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Scarica PDF
      </button>

      {showFooter && (
        <div className="hidden-pdf-footer" style={{ position: 'absolute' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'left' }}>
            {new Date().toLocaleDateString()}<br />netlify.sys-c.app<br />@giusepperubino.eu
          </p>
        </div>
      )}
    </>
  );
};

export default DownloadPDFButton;

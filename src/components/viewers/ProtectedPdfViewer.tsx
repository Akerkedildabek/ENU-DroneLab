
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface ProtectedPdfViewerProps {
  url: string
  title: string
  description?: string
}

export function ProtectedPdfViewer({
  url,
  title,
  description
}: ProtectedPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [viewerWidth, setViewerWidth] = useState(700)

  useEffect(() => {
    setPageNumber(1)
    setNumPages(0)
  }, [url])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateWidth = () => {
      setViewerWidth(
        Math.max(
          200,
          Math.min(1080, Math.floor(container.clientWidth - 32))
        )
      )
    }

    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const previousPage = () => {
    setPageNumber(current => Math.max(1, current - 1))
  }

  const nextPage = () => {
    setPageNumber(current =>
      Math.min(numPages, current + 1)
    )
  }

  return (
    <div
      className="protected-pdf"
      ref={containerRef}
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
    >
      <div className="protected-pdf-header">
        <div className="protected-pdf-title">
          <span className="protected-pdf-icon">▣</span>
          <strong>{title}</strong>
        </div>

        <span className="protected-pdf-status">
          Тек қарау режимі
        </span>
      </div>

      <div className="protected-pdf-content">
        <Document
          file={url}
          loading={
            <div className="protected-pdf-loading">
              Презентация жүктелуде...
            </div>
          }
          error={
            <div className="protected-pdf-loading">
              PDF презентациясын ашу мүмкін болмады.
            </div>
          }
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages)
            setPageNumber(current =>
              Math.max(1, Math.min(current, numPages))
            )
          }}
        >
          <div className="protected-pdf-page">
            <Page
              pageNumber={pageNumber}
              width={viewerWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading="Слайд ашылуда..."
            />

            <div
              className="protected-pdf-watermark"
              aria-hidden="true"
            >
              <div>© IDSAI DRONE CENTER</div>
              <small>ОҚУ МАТЕРИАЛЫ</small>
            </div>
          </div>
        </Document>
      </div>

      <div className="protected-pdf-controls">
        <button
          type="button"
          onClick={previousPage}
          disabled={pageNumber <= 1}
        >
          ← Алдыңғы
        </button>

        <div className="protected-pdf-counter">
          <span>{pageNumber}</span>
          <span className="protected-pdf-separator">/</span>
          <span>{numPages || '...'}</span>
        </div>

        <button
          type="button"
          onClick={nextPage}
          disabled={numPages === 0 || pageNumber >= numPages}
        >
          Келесі →
        </button>
      </div>

      {description && (
        <p className="protected-pdf-description">
          {description}
        </p>
      )}

      <div className="protected-pdf-notice">
        © IDSAI Drone Center. Авторлық құқық қорғалған.
        Материал оқу мақсатында қарауға арналған.
        Автордың рұқсатынсыз таратуға болмайды.
      </div>
    </div>
  )
}

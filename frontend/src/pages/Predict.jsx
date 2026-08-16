import { useCallback, useState } from 'react'
import { Upload, X, AlertTriangle, CheckCircle, Loader2, Info } from 'lucide-react'
import { usePrediction } from '../hooks/usePrediction'
import { LCZ_CLASSES } from '../data/lczData'

const ACCEPTED = '.tif,.tiff,.npy,.png,.jpg,.jpeg'

function DropZone({ onFile, file }) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }, [onFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
        ${dragging ? 'border-blue-500 bg-blue-600/10' : 'border-[#1e2d45] hover:border-blue-600/50 hover:bg-[#0d1526]'}`}
      onClick={() => document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
      <Upload size={32} className="mx-auto mb-3 text-slate-500" />
      {file ? (
        <p className="text-sm text-slate-300 font-medium">{file.name}</p>
      ) : (
        <>
          <p className="text-sm text-slate-300 font-medium mb-1">Drop satellite patch here</p>
          <p className="text-xs text-slate-500">Supports: .tif, .tiff, .npy, .png, .jpg</p>
        </>
      )}
    </div>
  )
}

function PredictionResult({ result }) {
  const topClass = LCZ_CLASSES.find(c => c.code === result.predicted_class)

  return (
    <div className="space-y-4">
      {/* Main result */}
      <div className="card border-blue-600/40 bg-blue-600/5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">Predicted LCZ Class</p>
            <p className="text-3xl font-bold text-blue-400">{result.predicted_class}</p>
            <p className="text-slate-300 font-medium mt-1">{topClass?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Confidence</p>
            <p className="text-3xl font-bold text-emerald-400">{(result.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>
        {topClass && (
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-[#1e2d45]">{topClass.description}</p>
        )}
      </div>

      {/* Top 3 */}
      <div className="card">
        <p className="text-sm font-semibold mb-3">Top Predictions</p>
        <div className="space-y-2.5">
          {result.top_predictions.map(({ class: cls, probability }, i) => {
            const lczInfo = LCZ_CLASSES.find(c => c.code === cls)
            const pct = (probability * 100).toFixed(1)
            return (
              <div key={cls}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold w-4 ${i === 0 ? 'text-blue-400' : 'text-slate-500'}`}>#{i + 1}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lczInfo?.color || '#64748b' }} />
                    <span className="font-medium">{cls}</span>
                    <span className="text-slate-500 text-xs">— {lczInfo?.name}</span>
                  </div>
                  <span className={i === 0 ? 'text-blue-400 font-semibold' : 'text-slate-400'}>{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-slate-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Input info */}
      {result.input_info && (
        <div className="card text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-400 mb-2">Input Details</p>
          {Object.entries(result.input_info).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="capitalize">{k.replace(/_/g, ' ')}</span>
              <span className="text-slate-300">{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Predict() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const { result, loading, error, predict, reset } = usePrediction()

  const handleFile = (f) => {
    setFile(f)
    reset()
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    reset()
  }

  const handlePredict = () => {
    if (file) predict(file)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">LCZ Prediction</h1>
        <p className="text-slate-400 text-sm">Upload a satellite patch to classify its Local Climate Zone</p>
      </div>

      {/* Important notice */}
      <div className="flex gap-3 p-4 rounded-lg bg-amber-600/10 border border-amber-600/30 mb-6 text-sm">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-amber-200/80">
          <p className="font-medium mb-1">Multi-channel Input Required</p>
          <p className="text-xs leading-relaxed">
            The model expects an 18-channel tensor (Sentinel-1: 4ch + Sentinel-2: 14ch) at 32×32 pixels.
            Standard RGB images will be rejected unless the backend preprocessing module is configured
            to handle them. Upload a compatible .tif or .npy file for accurate predictions.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload panel */}
        <div className="space-y-4">
          <div className="card">
            <p className="section-title">Upload Satellite Patch</p>
            <DropZone onFile={handleFile} file={file} />

            {file && (
              <div className="mt-4 space-y-3">
                {/* File info */}
                <div className="flex items-center justify-between text-xs text-slate-400 bg-[#0d1526] rounded-lg px-3 py-2">
                  <span>{file.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <button onClick={handleClear} className="text-slate-500 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Image preview */}
                {preview && (
                  <div className="rounded-lg overflow-hidden border border-[#1e2d45]">
                    <p className="text-xs text-slate-500 px-3 py-1.5 bg-[#0d1526] border-b border-[#1e2d45] flex items-center gap-1.5">
                      <Info size={11} /> Visual preview only — not the actual ML input
                    </p>
                    <img src={preview} alt="Preview" className="w-full object-contain max-h-48 bg-black" />
                  </div>
                )}

                <button
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  onClick={handlePredict}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Running Inference…</>
                  ) : (
                    <><CheckCircle size={16} /> Predict LCZ</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Input spec */}
          <div className="card text-xs">
            <p className="font-semibold text-slate-300 mb-3">Expected Input Specification</p>
            <div className="space-y-2 text-slate-400">
              {[
                ['Shape', '(1, 32, 32, 18)'],
                ['Channels', 'S1: VV, VH, VV/VH, VH/VV + S2: B2–B12 + indices'],
                ['Normalization', 'Configured in backend preprocessing.py'],
                ['Formats', '.tif (GeoTIFF), .npy (NumPy array)'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-right font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div>
          {error && (
            <div className="card border-red-600/40 bg-red-600/5">
              <div className="flex gap-2 text-red-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Prediction Error</p>
                  <p className="text-xs text-red-300/80">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && <PredictionResult result={result} />}

          {!result && !error && (
            <div className="card h-full min-h-48 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#0d1526] border border-[#1e2d45] flex items-center justify-center mb-3">
                <CheckCircle size={20} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">Prediction results will appear here</p>
              <p className="text-slate-600 text-xs mt-1">Upload a file and click Predict LCZ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

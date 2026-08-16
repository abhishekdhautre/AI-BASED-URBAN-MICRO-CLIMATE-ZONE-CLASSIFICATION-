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
        ${dragging ? 'border-amber-500 bg-amber-600/5' : 'border-[#2a2a2a] hover:border-zinc-600 hover:bg-[#111111]'}`}
      onClick={() => document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
      <Upload size={32} className="mx-auto mb-3 text-zinc-600" />
      {file ? (
        <p className="text-sm text-zinc-300 font-medium">{file.name}</p>
      ) : (
        <>
          <p className="text-sm text-zinc-300 font-medium mb-1">Drop satellite patch here</p>
          <p className="text-xs text-zinc-600">Supports: .tif, .tiff, .npy, .png, .jpg</p>
        </>
      )}
    </div>
  )
}

function PredictionResult({ result }) {
  const topClass = LCZ_CLASSES.find(c => c.code === result.predicted_class)

  return (
    <div className="space-y-4">
      <div className="card border-amber-600/30 bg-amber-600/5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Predicted LCZ Class</p>
            <p className="text-3xl font-bold text-amber-400">{result.predicted_class}</p>
            <p className="text-zinc-300 font-medium mt-1">{topClass?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">Confidence</p>
            <p className="text-3xl font-bold text-emerald-400">{(result.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>
        {topClass && (
          <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-[#242424]">{topClass.description}</p>
        )}
      </div>

      <div className="card">
        <p className="text-sm font-semibold mb-3 text-zinc-200">Top Predictions</p>
        <div className="space-y-2.5">
          {result.top_predictions.map(({ class: cls, probability }, i) => {
            const lczInfo = LCZ_CLASSES.find(c => c.code === cls)
            const pct = (probability * 100).toFixed(1)
            return (
              <div key={cls}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold w-4 ${i === 0 ? 'text-amber-400' : 'text-zinc-600'}`}>#{i + 1}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lczInfo?.color || '#52525b' }} />
                    <span className="font-medium text-zinc-200">{cls}</span>
                    <span className="text-zinc-600 text-xs">— {lczInfo?.name}</span>
                  </div>
                  <span className={i === 0 ? 'text-amber-400 font-semibold' : 'text-zinc-500'}>{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${i === 0 ? 'bg-amber-500' : 'bg-zinc-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {result.input_info && (
        <div className="card text-xs text-zinc-600 space-y-1">
          <p className="font-medium text-zinc-400 mb-2">Input Details</p>
          {Object.entries(result.input_info).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="capitalize">{k.replace(/_/g, ' ')}</span>
              <span className="text-zinc-300">{String(v)}</span>
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
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }

  const handleClear = () => { setFile(null); setPreview(null); reset() }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">LCZ Prediction</h1>
        <p className="text-zinc-500 text-sm">Upload a satellite patch to classify its Local Climate Zone</p>
      </div>

      <div className="flex gap-3 p-4 rounded-lg bg-amber-600/8 border border-amber-600/20 mb-6 text-sm">
        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="text-amber-200/70">
          <p className="font-medium mb-1">Multi-channel Input Required</p>
          <p className="text-xs leading-relaxed">
            The model expects an 18-channel tensor (Sentinel-1: 4ch + Sentinel-2: 14ch) at 32×32 pixels.
            Standard RGB images will be rejected. Upload a compatible .tif or .npy file for accurate predictions.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card">
            <p className="section-title">Upload Satellite Patch</p>
            <DropZone onFile={handleFile} file={file} />

            {file && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500 bg-[#0f0f0f] rounded-lg px-3 py-2 border border-[#242424]">
                  <span>{file.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <button onClick={handleClear} className="text-zinc-600 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {preview && (
                  <div className="rounded-lg overflow-hidden border border-[#242424]">
                    <p className="text-xs text-zinc-600 px-3 py-1.5 bg-[#0f0f0f] border-b border-[#242424] flex items-center gap-1.5">
                      <Info size={11} /> Visual preview only — not the actual ML input
                    </p>
                    <img src={preview} alt="Preview" className="w-full object-contain max-h-48 bg-black" />
                  </div>
                )}

                <button
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  onClick={() => predict(file)}
                  disabled={loading}
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Running Inference…</>
                    : <><CheckCircle size={16} /> Predict LCZ</>
                  }
                </button>
              </div>
            )}
          </div>

          <div className="card text-xs">
            <p className="font-semibold text-zinc-300 mb-3">Expected Input Specification</p>
            <div className="space-y-2 text-zinc-500">
              {[
                ['Shape', '(1, 32, 32, 18)'],
                ['Channels', 'S1: VV, VH, VV/VH, VH/VV + S2: B2–B12 + indices'],
                ['Normalization', 'Configured in backend preprocessing.py'],
                ['Formats', '.tif (GeoTIFF), .npy (NumPy array)'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-zinc-600">{k}</span>
                  <span className="text-right font-mono text-zinc-400">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {error && (
            <div className="card border-red-600/30 bg-red-600/5">
              <div className="flex gap-2 text-red-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Prediction Error</p>
                  <p className="text-xs text-red-300/70">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && <PredictionResult result={result} />}

          {!result && !error && (
            <div className="card h-full min-h-48 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-3">
                <CheckCircle size={20} className="text-zinc-700" />
              </div>
              <p className="text-zinc-600 text-sm">Prediction results will appear here</p>
              <p className="text-zinc-700 text-xs mt-1">Upload a file and click Predict LCZ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

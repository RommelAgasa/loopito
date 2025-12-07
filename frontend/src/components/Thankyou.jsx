export default function ThankYou({ picks, showPickedName, onRestart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center border-4 border-emerald-700 max-w-sm">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-4">Thank You!</h2>
        <p className="text-emerald-700 font-semibold mb-4">Your Secret Santa pick has been recorded.</p>

        {showPickedName && (
          <>
            <p className="text-emerald-600 text-sm mb-2">You picked:</p>
            <p className="font-bold text-3xl text-red-600 mb-6">{Object.values(picks)[0]}</p>
          </>
        )}

        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-6">
          <p className="text-yellow-900 font-semibold text-sm">🤐 Remember to keep it secret!</p>
        </div>

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-red-600 to-emerald-700 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

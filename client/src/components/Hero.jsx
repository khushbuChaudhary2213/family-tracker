function Hero({ onTriggerAuth }) {
  return (
    <main className="my-auto py-16 space-y-8 max-w-3xl text-center flex flex-col items-center mx-auto w-full">
      <div className="space-y-4 w-full flex flex-col items-center">
        <h1 className="text-[48px] sm:text-[68px] font-black tracking-tighter text-[#b0c6ff] leading-[1.05]">
          Keep your family <br />
          <span className="text-white">connected, safely.</span>
        </h1>
        <p className="text-base sm:text-xl text-[#8c90a0] leading-relaxed max-w-xl font-normal mx-auto">
          Sentry creates an encrypted protective mesh for your inner circle.
          View synchronized locations instantly, issue secure cryptographic code
          entries, and distribute network rights with complete admin controls.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center w-full">
        <button
          onClick={() => onTriggerAuth("signup")}
          className="px-8 py-4 bg-[#b0c6ff] text-[#002d6e] rounded-xl font-bold text-base shadow-lg shadow-[#b0c6ff]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-center sm:w-auto"
        >
          Get Started Free
        </button>
        <button
          onClick={() => onTriggerAuth("login")}
          className="px-8 py-4 bg-[#1e1e1e]/90 border border-white/10 hover:bg-[#252525] text-white rounded-xl font-bold text-base transition-all duration-200 cursor-pointer text-center sm:w-auto"
        >
          Access Secure Vault
        </button>
      </div>
    </main>
  );
}

export default Hero;

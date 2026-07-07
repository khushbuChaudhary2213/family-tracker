function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#8c90a0] border-t border-white/5 pt-6 w-full">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.6)]"></span>
        <span className="tracking-widest uppercase text-[10px] font-bold text-[#c2c6d7]">
          SENTRY REPLICATED SECURITY LAYER ACTIVE
        </span>
      </div>
      <div className="text-[11px] text-[#8c90a0]/60">
        © 2026 Sentry Security Platforms. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

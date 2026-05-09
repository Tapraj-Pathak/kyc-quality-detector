function OverlayGuide() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
      <div className="absolute left-1/2 top-1/2 h-[62%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border-2 border-white/90 shadow-[0_0_0_999px_rgba(4,17,10,0.24)] transition-all duration-300">
        <div className="absolute -left-[2px] -top-[2px] h-8 w-8 rounded-tl-[28px] border-l-4 border-t-4 border-brand-accent" />
        <div className="absolute -right-[2px] -top-[2px] h-8 w-8 rounded-tr-[28px] border-r-4 border-t-4 border-brand-accent" />
        <div className="absolute -bottom-[2px] -left-[2px] h-8 w-8 rounded-bl-[28px] border-b-4 border-l-4 border-brand-accent" />
        <div className="absolute -bottom-[2px] -right-[2px] h-8 w-8 rounded-br-[28px] border-b-4 border-r-4 border-brand-accent" />
      </div>

      <div className="absolute bottom-5 left-1/2 w-[80%] -translate-x-1/2 rounded-full bg-black/35 px-4 py-2 text-center text-xs font-medium tracking-[0.08em] text-white/90 backdrop-blur-sm">
        Place your document fully inside the frame
      </div>
    </div>
  );
}

export default OverlayGuide;

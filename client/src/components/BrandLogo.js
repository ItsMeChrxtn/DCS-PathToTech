import React from 'react';

const sizeMap = {
  sm: { box: 'w-9 h-9', title: 'text-lg', subtitle: 'text-[9px]' },
  md: { box: 'w-11 h-11', title: 'text-xl', subtitle: 'text-[10px]' },
  lg: { box: 'w-14 h-14', title: 'text-2xl', subtitle: 'text-[11px]' },
};

const BrandLogo = ({ size = 'md', showSubtitle = true, dark = false }) => {
  const conf = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3">
      <div className={`logo-mark ${conf.box} rounded-2xl flex items-center justify-center shadow-elegant`}>
        <img
          src="/pathtotech-logo.svg"
          alt="PathToTech logo"
          className="w-full h-full object-contain rounded-2xl"
        />
      </div>
      <div>
        <span className={`block leading-tight font-extrabold tracking-tight ${conf.title} ${dark ? 'text-[#1f1d1d]' : 'text-white'}`}>
          PathToTech
        </span>
        {showSubtitle && (
          <span className={`block uppercase tracking-[0.2em] ${conf.subtitle} ${dark ? 'text-[#7b6f67]' : 'text-white/70'}`}>
            Employability Intelligence
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;

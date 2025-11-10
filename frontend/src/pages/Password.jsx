import React, { useState } from 'react';    
import { useNavigate } from 'react-router-dom'; 
import copyimage from '../assets/copyimage.png';

function Password() {
  const [length, setLength] = useState(10);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [password, setPassword] = useState('');
  const [copyMsg, setCopyMsg] = useState('');  
  const navigate = useNavigate();

  const getRandom = {
    upper: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    lower: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    number: () => String.fromCharCode(Math.floor(Math.random() * 10) + 48),
    symbol: () => '!@#$%^&*()_+{}[]:;<>,.?/~'.charAt(Math.floor(Math.random() * 22)),
  };

  const handleGenerate = () => {
    const enabled = [];
    if (includeUpper) enabled.push('upper');
    if (includeLower) enabled.push('lower');
    if (includeNumber) enabled.push('number');
    if (includeSymbol) enabled.push('symbol');
    if (!enabled.length || length < enabled.length) {
      setPassword('');
      return;
    }
    // Ensure at least one character from each type
    let pwdArr = enabled.map(type => getRandom[type]());
    for (let i = pwdArr.length; i < length; i++) {
      const type = enabled[Math.floor(Math.random() * enabled.length)];
      pwdArr.push(getRandom[type]());
    }
    // Shuffle
    for (let i = pwdArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pwdArr[i], pwdArr[j]] = [pwdArr[j], pwdArr[i]];
    }
    setPassword(pwdArr.join(''));
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopyMsg('Copied!');
    } catch {
      setCopyMsg('Failed');
    }
    setTimeout(() => setCopyMsg(''), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#160628] via-[#341c4f] to-[#58077d]">    
<button
  onClick={() => navigate("/Signup")}
  className="fixed top-4 right-4 px-5 py-2 text-white font-semibold border-2 border-white rounded-full text-sm sm:text-base shadow-md hover:bg-white hover:text-black transition duration-300 z-50"
>
  Signup
</button>

      <div className="bg-[#1f1137] rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl flex flex-col" style={{fontFamily: `'League Spartan', sans-serif`}}>   
   
        <h1 className="text-center text-white uppercase tracking-wider text-2xl font-extrabold mb-5">
          Password Generator
        </h1>    
   
        {/* Display */}
        <div className="relative flex items-center bg-[#23194b] rounded-lg border-b-4 border-[#a445ed] mb-5 h-14 px-4">
          <input
            className="flex-1 bg-transparent outline-none border-none text-[#ffd900] font-bold text-xl placeholder:text-[#ffe066] py-2 pr-12"
            type="text"
            readOnly
            value={password}
            placeholder="Password"
            style={{letterSpacing: '1px'}}
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent hover:bg-[#342058] rounded p-1 transition"
            onClick={handleCopy}
            tabIndex={0}
            aria-label="Copy password"
          >
            <img src={copyimage} alt="Copy" className="w-6 h-6" />
          </button>
          {copyMsg && (
            <span className="absolute right-14 top-1/2 -translate-y-1/2 text-xs text-[#ffd900] font-semibold bg-[#36255a] px-2 rounded transition">{copyMsg}</span>
          )}
        </div>
        {/* Controls */}
        <div className="mt-1 mb-4 bg-[#1f1137] rounded-xl px-3 py-4 space-y-4 flex flex-col">
          {/* Password Length */}
          <div className="flex items-center justify-between">
            <span className="text-white text-lg">Password length</span>
            <span className="text-[#ffd900] font-bold text-lg">{length}</span>
          </div>
          <input
            type="range"
            min={enabledCheckboxCount()}
            max={20}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-[#a445ed] h-2 rounded"
          />
          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={includeUpper} onChange={() => setIncludeUpper(v => !v)} className="accent-[#a445ed] w-5 h-5 rounded" />
              <span className="text-white text-base">Include Uppercase letter</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={includeLower} onChange={() => setIncludeLower(v => !v)} className="accent-[#a445ed] w-5 h-5 rounded" />
              <span className="text-white text-base">Include Lowercase letter</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={includeNumber} onChange={() => setIncludeNumber(v => !v)} className="accent-[#a445ed] w-5 h-5 rounded" />
              <span className="text-white text-base">Include Number</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={includeSymbol} onChange={() => setIncludeSymbol(v => !v)} className="accent-[#a445ed] w-5 h-5 rounded" />
              <span className="text-white text-base">Include Symbols</span>
            </label>
          </div>
        </div>
        {/* Generate Button */}
        <button
          className="w-full mt-2 bg-[#a445ed] text-[#ffd900] font-extrabold py-3 rounded-2xl shadow hover:bg-[#ffd900] hover:text-[#a445ed] border-b-4 border-[#ffd900] text-lg uppercase tracking-widest transition"
          onClick={handleGenerate}
        >
          Generate Password
        </button>
      </div>
    </div>
  );

  // Helper ensures you can't set password shorter than # checked boxes
  function enabledCheckboxCount() {
    return [includeUpper, includeLower, includeNumber, includeSymbol].filter(Boolean).length || 1;
  }
}

export default Password;

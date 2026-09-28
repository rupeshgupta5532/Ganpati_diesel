const fs = require('fs');
const file = 'src/features/auth/SignupForm.jsx';
let code = fs.readFileSync(file, 'utf8');

const newLogic = `
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        return setError('Passwords do not match');
      }
      setLoading(true);
      try {
        const response = await api.post('/auth/user/signup', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        if (response.data?.requiresOtp || response.requiresOtp) {
          setStep(2);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initiate signup. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: verify OTP
      setLoading(true);
      try {
        const response = await api.post('/auth/user/signup', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          otp
        });
        const payload = response.data || response;
        login(payload.accessToken, payload.user);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired OTP.');
      } finally {
        setLoading(false);
      }
    }
  };
`;

code = code.replace(
  /const handleSubmit = async \(e\) => \{[\s\S]*?setLoading\(false\);\n    \}\n  \};/,
  newLogic.trim()
);

code = code.replace(
  /const \[error, setError\] = useState\(''\);/,
  "const [error, setError] = useState('');\n  const [step, setStep] = useState(1);\n  const [otp, setOtp] = useState('');"
);

// Add OTP form logic in render
const formUI = `
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
`;

code = code.replace(
  /<form onSubmit=\{handleSubmit\} className="p-8 space-y-4">/,
  formUI.trim()
);

const otpFormUI = `
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-semibold rounded">{error}</div>}
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-accent/20 text-brand-accent rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📧</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Verify your email</h3>
              <p className="text-gray-500 dark:text-slate-400 mt-2">We sent a 6-digit OTP to <strong>{formData.email}</strong>.</p>
            </div>

            <div>
              <label className="block text-brand-primary dark:text-slate-200 text-sm font-bold mb-2 uppercase tracking-wide text-center">Enter 6-Digit OTP</label>
              <input 
                type="text" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                placeholder="000000"
                maxLength={6}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-accent focus:ring-0 outline-none transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:border-slate-700 text-center tracking-widest text-xl font-bold" 
                required 
              />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-brand-accent text-brand-primary py-4 rounded-lg font-bold text-lg shadow dark:shadow-none-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-bold">
              ← Back to Registration
            </button>
          </form>
        )}
      </div>
`;

code = code.replace(
  /          <\/form>\n      <\/div>/,
  otpFormUI.trim()
);

fs.writeFileSync(file, code);

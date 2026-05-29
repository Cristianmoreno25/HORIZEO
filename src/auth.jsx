/* ================================================================
   HORIZEO · Auth — Supabase Auth real
   - LoginForm: signInWithPassword + desafío MFA TOTP
   - RegisterForm: signUp → VerifyEmailScreen
   - ForgotPasswordScreen: resetPasswordForEmail
   - ResetPasswordScreen: updateUser (llegada desde enlace de correo)
   - ProfileScreen: updateProfile async + 2FA TOTP setup/unenroll
   - HU01-03 cubiertas
   ================================================================ */

// ---------------------- Logo ----------------------

function Logo({ color = 'var(--ink)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={color} strokeWidth="1.4" />
        <path d="M3 17 Q 14 11, 25 17" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="19" cy="11" r="1.2" fill={color} />
      </svg>
      <span style={{ fontFamily: 'var(--serif)', fontSize: 24, letterSpacing: '-0.02em' }}>Horizeo</span>
    </div>
  );
}

// ---------------------- VerificationBanner ----------------------

function VerificationBanner({ type, onDismiss }) {
  const isSuccess = type === 'success';
  return (
    <div style={{
      background: isSuccess ? 'var(--forest)' : 'var(--crimson)',
      color: '#FBF6EC',
      borderRadius: 'var(--r-lg)',
      padding: '18px 20px',
      marginBottom: 28,
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      boxShadow: 'var(--shadow-md)',
      animation: 'fade-in 0.35s ease-out',
    }}>
      <div style={{
        flexShrink: 0, width: 42, height: 42, borderRadius: 999,
        background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center',
      }}>
        <Icon name={isSuccess ? 'check' : 'alert'} size={20} stroke={2.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: 4, lineHeight: 1.15 }}>
          {isSuccess ? 'Correo verificado' : 'Enlace no válido'}
        </div>
        <div style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.5 }}>
          {isSuccess
            ? 'Tu cuenta está activa. Inicia sesión para comenzar a explorar.'
            : type === 'error_expired'
              ? 'El enlace de verificación expiró. Regístrate nuevamente o solicita un nuevo correo.'
              : 'No fue posible verificar tu cuenta. El enlace puede ser inválido o ya fue usado.'}
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Cerrar"
        style={{
          background: 'rgba(255,255,255,0.18)', border: 'none', color: '#FBF6EC',
          borderRadius: 999, width: 28, height: 28, display: 'grid', placeItems: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}

// ---------------------- AuthScreen (wrapper responsivo) ----------------------

function AuthScreenResp() {
  const { state, actions } = useStore();
  const showBanner = state.emailVerified || !!state.emailVerifyError;
  const bannerType = state.emailVerified
    ? 'success'
    : state.emailVerifyError === 'expired' ? 'error_expired' : 'error_invalid';

  return (
    <div className="auth-root" style={authStyles.root}>
      <div className="auth-hero" style={authStyles.hero}>
        <div style={authStyles.heroOverlay} />
        <div style={authStyles.heroContent}>
          <div style={authStyles.brandRow}>
            <Logo color="#FBF6EC" />
          </div>
          <div style={{ flex: 1 }} />
          <div style={authStyles.heroTextBlock}>
            <p style={authStyles.heroEyebrow}>Plataforma de viaje · Estética intencional</p>
            <h1 style={authStyles.heroTitle}>
              Viaja con <span className="serif-i" style={{ color: '#E9C4B5' }}>intención</span>,
              <br />
              no con prisa.
            </h1>
            <p style={authStyles.heroBody}>
              Descubre destinos curados, construye itinerarios al detalle y gestiona cada reserva
              en un solo lugar. Diseñado para viajeros que valoran el cómo tanto como el dónde.
            </p>
          </div>
          <div style={authStyles.heroFooter}>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>120+</div>
              <div style={authStyles.heroStatLabel}>destinos curados</div>
            </div>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>14k</div>
              <div style={authStyles.heroStatLabel}>itinerarios creados</div>
            </div>
            <div style={authStyles.heroStat}>
              <div style={authStyles.heroStatNum}>4.8</div>
              <div style={authStyles.heroStatLabel}>satisfacción media</div>
            </div>
          </div>
        </div>
      </div>
      <div style={authStyles.formSide}>
        <div style={authStyles.formInner}>
          {showBanner && (
            <VerificationBanner
              type={bannerType}
              onDismiss={actions.clearVerificationState}
            />
          )}
          <AuthFormSwitcher />
        </div>
      </div>
    </div>
  );
}

// ---------------------- AuthFormSwitcher ----------------------

function AuthFormSwitcher() {
  const [mode, setMode] = React.useState('login'); // login | register | forgot | verify
  const [verifyEmail, setVerifyEmail] = React.useState('');

  if (mode === 'verify') {
    return <VerifyEmailScreen email={verifyEmail} onBack={() => setMode('login')} />;
  }
  if (mode === 'forgot') {
    return <ForgotPasswordScreen onBack={() => setMode('login')} />;
  }

  return (
    <>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
        <Tabs
          tabs={[{ value: 'login', label: 'Iniciar sesión' }, { value: 'register', label: 'Crear cuenta' }]}
          value={mode}
          onChange={setMode}
        />
      </div>
      {mode === 'login'
        ? <LoginForm onSwap={() => setMode('register')} onForgot={() => setMode('forgot')} />
        : <RegisterForm onSwap={() => setMode('login')} onVerify={(email) => { setVerifyEmail(email); setMode('verify'); }} />
      }
    </>
  );
}

// ---------------------- LoginForm (HU02) ----------------------

function LoginForm({ onSwap, onForgot }) {
  const toast = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  // Estado de desafío MFA
  const [mfaStep, setMfaStep] = React.useState(false);
  const [mfaCode, setMfaCode] = React.useState('');
  const [mfaFactor, setMfaFactor] = React.useState(null);
  const [mfaChallenge, setMfaChallenge] = React.useState(null);
  const [mfaLoading, setMfaLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      const msg = error.message || '';
      if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
        setErrors({ _: 'Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.' });
      } else if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        setErrors({ _: 'Correo o contraseña incorrectos.' });
      } else {
        setErrors({ _: msg });
      }
      return;
    }

    // Verificar si se necesita 2FA (aal2)
    try {
      const { data: aalData } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.nextLevel === 'aal2' && aalData.nextLevel !== aalData.currentLevel) {
        const { data: factorsData } = await sb.auth.mfa.listFactors();
        const factor = factorsData?.totp?.[0];
        if (factor) {
          const { data: challenge } = await sb.auth.mfa.challenge({ factorId: factor.id });
          setMfaFactor(factor);
          setMfaChallenge(challenge);
          setMfaStep(true);
          return;
        }
      }
    } catch (_) { /* sin MFA configurado */ }
    // Si no hay MFA, onAuthStateChange maneja la sesión
  };

  const submitMfa = async (e) => {
    e.preventDefault();
    if (!mfaFactor || !mfaChallenge) return;
    setMfaLoading(true);
    const { error } = await sb.auth.mfa.verify({
      factorId: mfaFactor.id,
      challengeId: mfaChallenge.id,
      code: mfaCode.trim(),
    });
    setMfaLoading(false);
    if (error) {
      setErrors({ mfa: 'Código incorrecto. Intenta de nuevo.' });
    }
    // Si ok → onAuthStateChange eleva el nivel AAL2 y carga la app
  };

  // Pantalla del código TOTP
  if (mfaStep) {
    return (
      <form onSubmit={submitMfa} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: '2.4rem', marginBottom: 6 }}>Verificación en dos pasos.</h2>
          <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Ingresa el código de 6 dígitos de tu app autenticadora.</p>
        </div>
        {errors.mfa && (
          <div style={authStyles.errorBanner}>
            <Icon name="alert" size={16} />
            <span>{errors.mfa}</span>
          </div>
        )}
        <div className="field">
          <label className="field-label">Código TOTP</label>
          <input
            className="input"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            autoFocus
            style={{ fontFamily: 'var(--mono)', letterSpacing: '0.2em', fontSize: 20, textAlign: 'center' }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={mfaLoading || mfaCode.length < 6}
          style={{ width: '100%', justifyContent: 'center', opacity: (mfaLoading || mfaCode.length < 6) ? 0.6 : 1 }}
        >
          {mfaLoading ? 'Verificando…' : 'Verificar código'}
        </button>
        <button
          type="button"
          onClick={() => { setMfaStep(false); setMfaCode(''); setErrors({}); }}
          style={{ ...authStyles.link, textAlign: 'center', display: 'block' }}
        >
          Volver al inicio de sesión
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: 6 }}>Hola de nuevo.</h2>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Ingresa para continuar planeando tus viajes.</p>
      </div>

      {errors._ && (
        <div style={authStyles.errorBanner}>
          <Icon name="alert" size={16} />
          <span>{errors._}</span>
        </div>
      )}

      <div className="field">
        <label className="field-label">Correo electrónico</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required autoComplete="email" />
      </div>

      <div className="field">
        <label className="field-label">Contraseña</label>
        <div style={{ position: 'relative' }}>
          <input
            className="input"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            style={{ paddingRight: 42 }}
          />
          <button type="button" onClick={() => setShowPw(s => !s)} style={authStyles.pwToggle} aria-label="Mostrar contraseña">
            <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} />
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'right', marginTop: -8 }}>
        <button type="button" onClick={onForgot} style={{ ...authStyles.link, fontSize: 13 }}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
        style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'Verificando…' : 'Entrar'}
        {!loading && <Icon name="arrowRight" size={16} />}
      </button>

      <p style={{ fontSize: 14, color: 'var(--ink-soft)', textAlign: 'center', margin: 0 }}>
        ¿Aún no tienes cuenta?{' '}
        <button type="button" onClick={onSwap} style={authStyles.link}>Regístrate</button>
      </p>
    </form>
  );
}

// ---------------------- RegisterForm (HU01) ----------------------

function RegisterForm({ onSwap, onVerify }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!name.trim()) { setErrors({ name: 'Tu nombre es requerido' }); return; }
    if (password.length < 8) { setErrors({ password: 'La contraseña debe tener mínimo 8 caracteres' }); return; }
    setLoading(true);
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    });
    setLoading(false);
    if (error) {
      const msg = error.message || '';
      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('user_already_exists')) {
        setErrors({ email: 'Este correo ya está registrado. Inicia sesión.' });
      } else {
        setErrors({ _: msg });
      }
    } else {
      onVerify(email);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: 6 }}>Crea tu cuenta.</h2>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Comienza a curar tus viajes con intención.</p>
      </div>

      {errors._ && (
        <div style={authStyles.errorBanner}>
          <Icon name="alert" size={16} />
          <span>{errors._}</span>
        </div>
      )}

      <div className="field">
        <label className="field-label">Nombre completo</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cristian Moreno" required />
        {errors.name && <div className="field-error">{errors.name}</div>}
      </div>

      <div className="field">
        <label className="field-label">Correo electrónico</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>

      <div className="field">
        <label className="field-label">Contraseña</label>
        <div style={{ position: 'relative' }}>
          <input
            className="input"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
            style={{ paddingRight: 42 }}
          />
          <button type="button" onClick={() => setShowPw(s => !s)} style={authStyles.pwToggle}>
            <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} />
          </button>
        </div>
        {errors.password && <div className="field-error">{errors.password}</div>}
        <div className="field-help">
          {password.length >= 8
            ? <span style={{ color: 'var(--forest)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check" size={12} /> Longitud OK</span>
            : 'Mínimo 8 caracteres. Contraseña cifrada por Supabase (bcrypt).'
          }
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
        style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        {!loading && <Icon name="arrowRight" size={16} />}
      </button>

      <p style={{ fontSize: 12, color: 'var(--ink-mute)', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
        Al continuar aceptas los términos y la política de privacidad.
      </p>
      <div className="divider" />
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', textAlign: 'center', margin: 0 }}>
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onSwap} style={authStyles.link}>Inicia sesión</button>
      </p>
    </form>
  );
}

// ---------------------- VerifyEmailScreen ----------------------

function VerifyEmailScreen({ email, onBack }) {
  const toast = useToast();
  const [resending, setResending] = React.useState(false);

  const resend = async () => {
    setResending(true);
    const { error } = await sb.auth.resend({ type: 'signup', email });
    setResending(false);
    if (error) toast(error.message, { type: 'error' });
    else toast('Correo de verificación reenviado', { type: 'success' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--forest)', display: 'grid', placeItems: 'center', margin: '0 0 20px', color: '#FBF6EC' }}>
          <Icon name="mail" size={28} stroke={1.4} />
        </div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: 8 }}>Revisa tu correo.</h2>
        <p style={{ color: 'var(--ink-soft)', margin: 0, lineHeight: 1.65 }}>
          Enviamos un enlace de verificación a <strong>{email}</strong>. Haz clic en el enlace para activar tu cuenta y acceder a Horizeo.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="btn btn-soft"
          onClick={resend}
          disabled={resending}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {resending ? 'Enviando…' : 'Reenviar correo de verificación'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Icon name="arrowLeft" size={14} />
          Volver al inicio de sesión
        </button>
      </div>
      <p style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', margin: 0 }}>
        ¿No encuentras el correo? Revisa tu carpeta de spam.
      </p>
    </div>
  );
}

// ---------------------- ForgotPasswordScreen ----------------------

function ForgotPasswordScreen({ onBack }) {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const redirectTo = window.location.origin + window.location.pathname + '#/reset-password';
    const { error: err } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
  };

  if (sent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--forest)', display: 'grid', placeItems: 'center', margin: '0 0 20px', color: '#FBF6EC' }}>
            <Icon name="mail" size={28} stroke={1.4} />
          </div>
          <h2 style={{ fontSize: '2.4rem', marginBottom: 8 }}>Revisa tu correo.</h2>
          <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
            Enviamos un enlace de recuperación a <strong>{email}</strong>. Úsalo para establecer una nueva contraseña.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Icon name="arrowLeft" size={14} />
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: 8 }}>Recuperar contraseña.</h2>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>
      {error && (
        <div style={authStyles.errorBanner}>
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </div>
      )}
      <div className="field">
        <label className="field-label">Correo electrónico</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
        style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'Enviando…' : 'Enviar enlace de recuperación'}
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={onBack}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <Icon name="arrowLeft" size={14} />
        Volver
      </button>
    </form>
  );
}

// ---------------------- ResetPasswordScreen (llegada desde enlace de correo) ----------------------

function ResetPasswordScreen() {
  const toast = useToast();
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('La contraseña debe tener mínimo 8 caracteres'); return; }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    setLoading(true);
    const { error: err } = await sb.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setDone(true);
      toast('Contraseña actualizada correctamente', { type: 'success' });
      setTimeout(() => { window.location.hash = '/explore'; }, 2000);
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--forest)', display: 'grid', placeItems: 'center', margin: '0 auto 20px', color: '#FBF6EC' }}>
            <Icon name="check" size={32} stroke={2.5} />
          </div>
          <h2 style={{ margin: '0 0 8px' }}>¡Contraseña actualizada!</h2>
          <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Redirigiendo a la app…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ marginBottom: 40 }}>
          <Logo />
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: '2.4rem', marginBottom: 8 }}>Nueva contraseña.</h2>
            <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Elige una contraseña segura de al menos 8 caracteres.</p>
          </div>
          {error && (
            <div style={authStyles.errorBanner}>
              <Icon name="alert" size={16} />
              <span>{error}</span>
            </div>
          )}
          <div className="field">
            <label className="field-label">Nueva contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                autoFocus
                style={{ paddingRight: 42 }}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={authStyles.pwToggle}>
                <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} />
              </button>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Confirmar contraseña</label>
            <input
              className="input"
              type={showPw ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Actualizando…' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------- ProfileScreen (HU03) ----------------------

function ProfileScreen() {
  const { state, actions } = useStore();
  const toast = useToast();
  const u = state.user;
  const [name, setName] = React.useState(u?.name || '');
  const [budget, setBudget] = React.useState(u?.prefs?.budget || 2000000);
  const [experiences, setExperiences] = React.useState(u?.prefs?.experiences || []);
  const [saving, setSaving] = React.useState(false);

  const toggleExp = (v) => {
    setExperiences(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const save = async () => {
    setSaving(true);
    const res = await actions.updateProfile({ name: name.trim(), prefs: { budget, experiences } });
    setSaving(false);
    if (res.ok) toast('Perfil actualizado · las recomendaciones reflejan tus preferencias', { type: 'success' });
    else toast(res.error || 'Error al guardar el perfil', { type: 'error' });
  };

  if (!u) return null;

  return (
    <div className="container-narrow" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 40 }}>
        <p style={authStyles.eyebrow}>Tu perfil</p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginBottom: 12 }}>
          Hola, <span className="serif-i">{u.name.split(' ')[0]}</span>.
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 17, margin: 0, maxWidth: 540 }}>
          Ajusta tus preferencias para recibir destinos y experiencias alineadas a tu manera de viajar.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        <section>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 16 }}>Datos personales</h3>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="field">
              <label className="field-label">Nombre</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Correo</label>
              <input className="input" type="email" value={u.email} disabled style={{ opacity: 0.6 }} />
              <div className="field-help">El correo se gestiona desde Supabase Auth.</div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Presupuesto habitual</h3>
          <p style={{ color: 'var(--ink-soft)', margin: '0 0 18px', fontSize: 14 }}>
            Usaremos este valor para sugerirte destinos ajustados a tu rango.
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span className="serif" style={{ fontSize: '2.8rem' }}>{formatCOP(budget)}</span>
            <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>COP por viaje</span>
          </div>
          <input
            type="range" min="500000" max="10000000" step="100000" value={budget}
            onChange={(e) => setBudget(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--ink)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>
            <span>$500K</span>
            <span>$10M</span>
          </div>
        </section>

        <div className="divider" />

        <section>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Tipo de experiencia</h3>
          <p style={{ color: 'var(--ink-soft)', margin: '0 0 18px', fontSize: 14 }}>
            Selecciona las que más te interesan. Puedes elegir varias.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EXPERIENCE_OPTIONS.map((opt) => {
              const active = experiences.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleExp(opt.value)}
                  style={{
                    padding: '10px 18px', borderRadius: 999, fontSize: 14, fontWeight: 500,
                    border: '1px solid ' + (active ? 'var(--ink)' : 'var(--border)'),
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--card)' : 'var(--ink)',
                    transition: 'all 0.15s',
                  }}
                >
                  {active && <Icon name="check" size={13} style={{ marginRight: 6, verticalAlign: '-2px' }} />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="divider" />

        <TwoFactorSetup />

        <div className="divider" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button
            className="btn btn-danger"
            onClick={async () => {
              if (confirm('¿Cerrar sesión?')) await actions.logout();
            }}
          >
            <Icon name="logout" size={15} />
            Cerrar sesión
          </button>
          <button className="btn btn-primary btn-lg" onClick={save} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------- TwoFactorSetup (TOTP MFA) ----------------------

function TwoFactorSetup() {
  const toast = useToast();
  const [loading, setLoading] = React.useState(true);
  const [activeFactor, setActiveFactor] = React.useState(null);
  const [step, setStep] = React.useState('idle'); // idle | enrolling | verify
  const [enrollData, setEnrollData] = React.useState(null);
  const [code, setCode] = React.useState('');
  const [codeError, setCodeError] = React.useState('');

  React.useEffect(() => {
    sb.auth.mfa.listFactors().then(({ data }) => {
      const totp = data?.totp || [];
      setActiveFactor(totp.find(f => f.status === 'verified') || null);
      setLoading(false);
    });
  }, []);

  const startEnroll = async () => {
    setStep('enrolling');
    const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp' });
    if (error) { toast(error.message, { type: 'error' }); setStep('idle'); return; }
    setEnrollData({ id: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
    setStep('verify');
  };

  const verifyEnroll = async () => {
    if (!enrollData || code.length < 6) return;
    setCodeError('');
    const { data: challenge, error: ce } = await sb.auth.mfa.challenge({ factorId: enrollData.id });
    if (ce) { setCodeError(ce.message); return; }
    const { error: ve } = await sb.auth.mfa.verify({
      factorId: enrollData.id,
      challengeId: challenge.id,
      code: code.trim(),
    });
    if (ve) { setCodeError('Código incorrecto. Intenta de nuevo.'); return; }
    setActiveFactor({ id: enrollData.id, status: 'verified', factor_type: 'totp' });
    setStep('idle');
    setEnrollData(null);
    setCode('');
    toast('Autenticación de dos factores activada', { type: 'success' });
  };

  const unenroll = async () => {
    if (!activeFactor) return;
    if (!confirm('¿Desactivar la autenticación de dos factores? Tu cuenta quedará menos protegida.')) return;
    const { error } = await sb.auth.mfa.unenroll({ factorId: activeFactor.id });
    if (error) { toast(error.message, { type: 'error' }); return; }
    setActiveFactor(null);
    toast('2FA desactivado', { type: 'default' });
  };

  if (loading) return null;

  return (
    <section>
      <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Seguridad</h3>
      <p style={{ color: 'var(--ink-soft)', margin: '0 0 18px', fontSize: 14 }}>
        La autenticación de dos factores (2FA) agrega una capa extra de seguridad al inicio de sesión mediante un código TOTP.
      </p>

      {activeFactor ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'rgba(61, 90, 71, 0.08)', borderRadius: 'var(--r-md)', border: '1px solid rgba(61, 90, 71, 0.2)' }}>
          <Icon name="check" size={18} style={{ color: 'var(--forest)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: 14 }}>2FA activado (TOTP)</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Usas una app autenticadora para verificar tu identidad.</div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={unenroll}>Desactivar</button>
        </div>
      ) : step === 'verify' && enrollData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            Escanea el código QR con Google Authenticator o cualquier app TOTP compatible:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={enrollData.qrCode} alt="QR Code 2FA" width={200} height={200} style={{ borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }} />
          </div>
          <details>
            <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--ink-mute)' }}>Ver clave manual</summary>
            <code style={{ display: 'block', marginTop: 8, padding: '8px 12px', background: 'var(--bg-soft)', borderRadius: 'var(--r-sm)', fontSize: 12, letterSpacing: '0.06em', wordBreak: 'break-all' }}>
              {enrollData.secret}
            </code>
          </details>
          <div className="field">
            <label className="field-label">Código de verificación (6 dígitos)</label>
            <input
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              style={{ fontFamily: 'var(--mono)', letterSpacing: '0.2em', textAlign: 'center' }}
            />
            {codeError && <div className="field-error">{codeError}</div>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost"
              onClick={() => { setStep('idle'); setEnrollData(null); setCode(''); setCodeError(''); }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={verifyEnroll}
              disabled={code.length < 6}
              style={{ opacity: code.length < 6 ? 0.6 : 1 }}
            >
              Verificar y activar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-soft"
          onClick={startEnroll}
          disabled={step === 'enrolling'}
          style={{ opacity: step === 'enrolling' ? 0.6 : 1 }}
        >
          {step === 'enrolling' ? 'Configurando…' : 'Activar autenticación de dos factores'}
        </button>
      )}
    </section>
  );
}

// ---------------------- Styles ----------------------

const authStyles = {
  root: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  hero: {
    position: 'relative',
    background: 'linear-gradient(160deg, #1A1816 0%, #2D2620 60%, #4A2918 100%)',
    color: '#FBF6EC',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80")',
    backgroundSize: 'cover', backgroundPosition: 'center',
    opacity: 0.35,
    mixBlendMode: 'luminosity',
  },
  heroContent: {
    position: 'relative',
    padding: '48px 56px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  brandRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  heroTextBlock: { maxWidth: 520 },
  heroEyebrow: {
    fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase',
    color: '#E9C4B5', margin: '0 0 24px',
  },
  heroTitle: {
    fontFamily: 'var(--serif)', fontSize: 'clamp(3rem, 5vw, 4.5rem)',
    fontWeight: 400, lineHeight: 1.0, margin: 0, color: '#FBF6EC',
  },
  heroBody: {
    color: 'rgba(251, 246, 236, 0.75)',
    fontSize: 17, lineHeight: 1.6, marginTop: 24, maxWidth: 440,
  },
  heroFooter: {
    display: 'flex', gap: 40, marginTop: 56, paddingTop: 28,
    borderTop: '1px solid rgba(251, 246, 236, 0.2)',
  },
  heroStat: { flex: 1 },
  heroStatNum: { fontFamily: 'var(--serif)', fontSize: 32, color: '#FBF6EC' },
  heroStatLabel: { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(251, 246, 236, 0.55)', marginTop: 2 },

  formSide: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 32px',
    background: 'var(--bg)',
    overflowY: 'auto',
  },
  formInner: { width: '100%', maxWidth: 440 },

  errorBanner: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', background: 'rgba(139, 42, 42, 0.08)',
    color: 'var(--crimson)', borderRadius: 'var(--r-md)', fontSize: 14,
    border: '1px solid rgba(139, 42, 42, 0.2)',
  },
  pwToggle: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--ink-soft)', padding: 6, borderRadius: 6,
  },
  link: {
    color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 2,
    fontWeight: 500, fontSize: 14, cursor: 'pointer',
    background: 'none', border: 'none', padding: 0, fontFamily: 'inherit',
  },
  eyebrow: {
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', margin: '0 0 14px',
  },
};

// Responsive: ocultar hero en mobile
{
  const id = 'horizeo-auth-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @media (max-width: 880px) {
        .auth-root { grid-template-columns: 1fr !important; }
        .auth-hero { display: none !important; }
      }
    `;
    document.head.appendChild(s);
  }
}

Object.assign(window, {
  AuthScreen: AuthScreenResp,
  ProfileScreen,
  Logo,
  ResetPasswordScreen,
});

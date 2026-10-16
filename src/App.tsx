import { useEffect, useState } from 'react';
import { Bell, Camera, Check, ChevronLeft, ChevronRight, Clock3, FlipHorizontal, Image as ImageIcon, Info, Lock, MapPin, Sparkles, Timer, Users, X, Zap } from 'lucide-react';

type Screen = 1 | 2 | 3 | 4 | 5;
type Preferences = { enabled: boolean; badge: boolean; notify: boolean; friends: boolean };

const initialPreferences: Preferences = { enabled: true, badge: true, notify: true, friends: false };

function StatusBar({ dark = false }: { dark?: boolean }) {
  return <div className={`topline ${dark ? 'quiet' : ''}`} style={{ paddingTop: 12, paddingBottom: 2, fontSize: 12 }}>
    <span>9:41</span><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>●●● <span>▰</span></span>
  </div>;
}

function Toggle({ value, label, onChange }: { value: boolean; label: string; onChange: () => void }) {
  return <button type="button" aria-label={label} aria-pressed={value} data-testid={`toggle-${label.toLowerCase().replaceAll(' ', '-')}`} className={`switch ${value ? 'on' : ''}`} onClick={onChange}><span /></button>;
}

function App() {
  const [screen, setScreen] = useState<Screen>(1);
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try { return { ...initialPreferences, ...JSON.parse(localStorage.getItem('catchup-preferences') ?? '{}') }; }
    catch { return initialPreferences; }
  });
  const [seconds, setSeconds] = useState(60 * 60);
  const [caption, setCaption] = useState('');
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState<'off' | 'how' | null>(null);
  const [expandedInfo, setExpandedInfo] = useState<'what' | 'earn' | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);

  useEffect(() => {
    if (screen !== 2) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [screen]);
  useEffect(() => { localStorage.setItem('catchup-preferences', JSON.stringify(preferences)); }, [preferences]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const updatePreference = (key: keyof Preferences, value?: boolean) => setPreferences((current) => ({ ...current, [key]: value ?? !current[key] }));
  const notifyDemo = (message: string) => setToast(message);
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const back = () => setScreen((current) => current === 5 ? 4 : current === 4 ? 3 : current === 3 ? 2 : 1);

  return <main className="app-shell">
    <div className={`device ${screen === 1 ? 'device-wide' : ''}`} data-testid="bereal-prototype">
      {screen === 1 && <section className="screen" aria-label="Missed drop">
        <div className="pill yellow-pill" style={{ borderRadius: 0, justifyContent: 'center', padding: '9px 12px' }}><Sparkles size={14} /> New: Catch-Up Pass — never miss a day</div>
        <StatusBar />
        <header className="topline"><span aria-hidden="true" style={{ width: 30 }} /><div className="brand">BeReal.</div><button className="icon-button" aria-label="Notifications" data-testid="button-notifications" onClick={() => notifyDemo('You’re all caught up on notifications.')}><Bell size={20} /></button></header>
        <div className="notice" data-testid="status-missed-drop">
          <div className="notice-icon"><Camera size={20} /></div><div><div className="notice-title">You missed today’s BeReal</div><div className="notice-copy">{preferences.enabled ? 'You have 1 Catch-Up Pass available' : 'Catch-Up Pass is turned off in your preferences'}</div></div>
        </div>
        <div className="locked-feed">
          {['Alex', 'Sarah', 'Mike'].map((name) => <div className="locked-card" key={name}>
            <div className="locked-content"><div className="avatar">{name[0]}</div><Lock size={17} color="#87877f" /><div className="locked-label">Post to see {name}’s BeReal</div></div>
          </div>)}
        </div>
        <div className="bottom-action">
          <button className="primary-btn" data-testid="button-use-pass" onClick={() => preferences.enabled ? setScreen(2) : notifyDemo('Turn Catch-Up Pass back on in Settings to continue.')}><Camera size={18} /> Use Catch-Up Pass</button>
          <button className="icon-button quiet" style={{ justifySelf: 'center', fontSize: 12, textDecoration: 'underline', padding: 2 }} data-testid="button-how-it-works" onClick={() => setModal('how')}>How does this work?</button>
          <div className="microcopy">1 pass remaining · Resets at midnight</div>
        </div>
      </section>}
      {screen === 1 && <aside className="desktop-rail"><div className="rail-step">A little room for real life</div><h2>Late is still<br />better than never.</h2><p>Missed the drop? Your Catch-Up Pass gives you one honest moment to post today. No pretending you were on time.</p><div style={{ display: 'flex', gap: 8, marginTop: 20 }}><span className="pill yellow-pill"><Clock3 size={14} /> 1 hour to post</span><span className="pill" style={{ background: '#e7f0f1', color: '#49636a' }}><Lock size={13} /> Friends only</span></div><div style={{ marginTop: 42, borderTop: '1px solid #e7e5df', paddingTop: 18, color: '#9a988f', fontSize: 12 }}>A small prototype for showing up as you are.</div></aside>}

      {screen === 2 && <section className="screen capture-screen" aria-label="Capture your BeReal">
        <StatusBar dark />
        <div className="capture-topline"><button className="icon-button" aria-label="Go back" data-testid="button-back-capture" onClick={back}><ChevronLeft size={26} /></button><div className="page-title">Catch-Up BeReal</div><button className="icon-button" aria-label="Capture help" data-testid="button-capture-help" onClick={() => notifyDemo('Both camera views are represented in this browser demo.')}><Zap size={20} /></button></div>
        <div className="camera-stage"><div className="camera-main-label">Front Camera</div><div className="camera-inset">Rear Camera</div></div>
        <div className="pill yellow-pill" style={{ margin: '18px auto 0', background: '#332d1b', color: '#f5dc5d', border: '1px solid #514724' }}><Sparkles size={14} /> You’ve been real 2 days in a row — keep it up!</div>
        <div className="pill countdown" data-testid="countdown-capture"><Clock3 size={16} /> {formattedTime} remaining</div>
        <div className="microcopy" style={{ color: '#ffffff77', marginTop: 10 }}>Both cameras capture simultaneously</div>
        <div className="capture-control-row">
          <button className="circle-control" aria-label="Flip cameras" data-testid="button-flip-camera" onClick={() => notifyDemo('Camera flip is a visual demo control.')}><FlipHorizontal size={19} /></button>
          <button className="shutter" aria-label="Capture moment" data-testid="button-capture" onClick={() => setScreen(3)}><span /></button>
          <div style={{ display: 'flex', gap: 9 }}><button className="circle-control" aria-label="Choose from photos" data-testid="button-photo-library" onClick={() => notifyDemo('Photo library access is not enabled in this demo.')}><ImageIcon size={18} /></button><button className="circle-control" aria-label="Timer options" data-testid="button-timer" onClick={() => notifyDemo('The Catch-Up timer gives you one hour from now.')}><Timer size={18} /></button></div>
        </div>
        <div className="capture-footer">Tap to capture your late BeReal</div>
      </section>}

      {screen === 3 && <section className="screen" aria-label="Preview and tag">
        <StatusBar />
        <div className="topline"><button className="icon-button" aria-label="Back to camera" data-testid="button-back-preview" onClick={back}><ChevronLeft size={25} /></button><div className="page-title">Preview</div><button className="secondary-btn" style={{ minHeight: 34, padding: '6px 13px', fontSize: 12 }} data-testid="button-retake" onClick={() => setScreen(2)}>Retake</button></div>
        <div className="microcopy" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, margin: '5px 0 12px', letterSpacing: '.12em', textTransform: 'uppercase' }}><span style={{ width: 7, height: 7, borderRadius: 8, background: '#91b47e' }} /> Catch-Up Pass Active</div>
        <div className="photo-placeholder preview-stage"><div className="camera-main-label" style={{ color: '#72736d' }}>Front Camera</div><div className="camera-inset">Rear Camera</div><div className="pill" style={{ position: 'absolute', right: 12, top: 12, zIndex: 1, background: '#222321df', color: 'white', fontSize: 10 }}>Catch-Up · Today</div></div>
        <label className="caption-wrap"><input className="caption-input" data-testid="input-caption" placeholder="Add a caption..." value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={90} /></label>
        <div className="tag-row"><button className="tag-chip" data-testid="button-tag-friends" onClick={() => notifyDemo('Friend tagging will be available when accounts are connected.')}><Users size={15} /> Tag Friends</button><button className="tag-chip" data-testid="button-add-location" onClick={() => notifyDemo('Location is not collected in this browser demo.')}><MapPin size={15} /> Add Location</button></div>
        <div style={{ margin: '17px 20px 4px', height: 1, background: '#efeee9' }} />
        <div className="setting-row"><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><div className="notice-icon" style={{ width: 34, height: 34, background: '#f3f2ee' }}><Lock size={15} /></div><div style={{ fontWeight: 700, fontSize: 13 }}>Friends only</div></div><Toggle label="Friends only" value={true} onChange={() => notifyDemo('Catch-Up posts are shared with friends only.')} /></div>
        <div className="bottom-action" style={{ position: 'relative', marginTop: 'auto' }}>
          <button className="primary-btn" data-testid="button-post-late" onClick={() => { setScreen(4); setSeconds(60 * 60); }}>Post Late BeReal</button><div className="microcopy">Friends will see this was a Catch-Up post</div>
        </div>
      </section>}

      {screen === 4 && <section className="screen" aria-label="Posted feed">
        <StatusBar />
        <header className="topline"><span style={{ width: 25 }} /><div className="brand">BeReal.</div><button className="icon-button" aria-label="Notifications" data-testid="button-feed-notifications" onClick={() => notifyDemo('Your friends will see your Catch-Up post.')}><Bell size={20} /></button></header>
        <div className="success-banner" data-testid="status-post-success"><div className="notice-icon" style={{ width: 32, height: 32, background: '#dcebd8', color: '#4b754e' }}><Check size={18} /></div><div><div style={{ fontWeight: 800, fontSize: 13 }}>Your late BeReal is live!</div><div style={{ fontSize: 11, marginTop: 3, color: '#598164' }}>Posted 1 hour after the drop</div></div></div>
        <div className="feed-wrap">
          <FeedPost name="You" late="1h late" own caption={caption} reaction={reaction} onReact={() => setReaction((value) => value ? null : '❤️')} badge={preferences.badge} />
          <div className="streak-card"><Sparkles size={19} color="#ac8c19" /><div><div style={{ fontWeight: 800, fontSize: 13, color: '#725d17' }}>3-day streak!</div><div style={{ fontSize: 12, color: '#9c7c29', marginTop: 4, lineHeight: 1.45 }}>You’ve been real 3 days in a row. Come back tomorrow!</div></div></div>
          <div className="section-label" style={{ margin: '26px 0 8px', display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ height: 1, flex: 1, background: '#e9e7e1' }} />Your friends<span style={{ height: 1, flex: 1, background: '#e9e7e1' }} /></div>
          <FeedPost name="Alex" late="2h late" reaction="😲" onReact={() => notifyDemo('Alex’s post is a sample friend moment.')} badge={false} />
          <FeedPost name="Sarah" late="3h late" reaction="👎" onReact={() => notifyDemo('Sarah’s post is a sample friend moment.')} badge={false} />
        </div>
        <div className="bottom-action"><button className="secondary-btn" data-testid="button-continue-settings" onClick={() => setScreen(5)}>Continue</button></div>
      </section>}

      {screen === 5 && <section className="screen" aria-label="Settings and return cue">
        <div style={{ padding: '10px 12px', background: '#282a26', color: 'white', textAlign: 'center', fontSize: 11, fontWeight: 600 }}>Your friends are already reacting to your BeReal</div>
        <StatusBar />
        <div className="topline"><button className="icon-button" aria-label="Back to feed" data-testid="button-back-settings" onClick={back}><ChevronLeft size={25} /></button><div className="page-title">Catch-Up Pass</div><button className="icon-button" aria-label="Settings information" data-testid="button-settings-info" onClick={() => setModal('how')}><Info size={19} /></button></div>
        <div style={{ margin: '10px 20px 0', background: '#f8f7f3', border: '1px solid #e8e6df', borderRadius: 22, padding: 19 }}>
          <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-.055em' }}>Come back tomorrow</div>
          <div style={{ fontSize: 12, color: '#85847d', marginTop: 7 }}>Your next Catch-Up Pass resets at midnight</div>
          <div style={{ marginTop: 19 }}><div className="progress-track"><span /></div><div style={{ textAlign: 'right', color: '#99978f', fontSize: 10, fontWeight: 800, marginTop: 8 }}>1/1 PASSES USED TODAY</div></div>
        </div>
        <div className="section-label">Preferences</div>
        <div className="settings-card settings-group">
          <div className="settings-row"><span>Enable Catch-Up Pass</span><Toggle label="Enable Catch-Up Pass" value={preferences.enabled} onChange={() => updatePreference('enabled')} /></div>
          <div className="settings-row"><span>Show ‘Catch-Up’ badge on posts</span><Toggle label="Show Catch-Up badge on posts" value={preferences.badge} onChange={() => updatePreference('badge')} /></div>
          <div className="settings-row"><span>Notify me when pass resets</span><Toggle label="Notify me when pass resets" value={preferences.notify} onChange={() => updatePreference('notify')} /></div>
          <div className="settings-row"><span>Allow friends to see I used a pass</span><Toggle label="Allow friends to see I used a pass" value={preferences.friends} onChange={() => updatePreference('friends')} /></div>
        </div>
        <div className="settings-card" style={{ marginTop: 18 }}>
          <button className="info-row" data-testid="button-what-is-pass" onClick={() => setExpandedInfo(expandedInfo === 'what' ? null : 'what')}>What is a Catch-Up Pass? <ChevronRight size={17} /></button>
          {expandedInfo === 'what' && <div style={{ padding: '0 16px 14px', color: '#78776f', fontSize: 12, lineHeight: 1.55 }}>A Catch-Up Pass lets you post one late BeReal if you missed the daily drop. Your post is clearly marked as late, because real life happens.</div>}
          <button className="info-row" data-testid="button-how-passes-earned" onClick={() => setExpandedInfo(expandedInfo === 'earn' ? null : 'earn')}>How passes are earned <ChevronRight size={17} /></button>
          {expandedInfo === 'earn' && <div style={{ padding: '0 16px 14px', color: '#78776f', fontSize: 12, lineHeight: 1.55 }}>One pass is available each day. It refreshes at midnight whether you use it or not.</div>}
        </div>
        <div style={{ padding: '20px 20px 30px', textAlign: 'center' }}><button style={{ border: 0, background: 'transparent', color: '#a15f55', fontWeight: 700, fontSize: 12, cursor: 'pointer', padding: 10 }} data-testid="button-turn-off-pass" onClick={() => setModal('off')}>Turn off Catch-Up Pass</button></div>
      </section>}

      <div className="screen-indicators" aria-label={`Step ${screen} of 5`}>{[1, 2, 3, 4, 5].map((step) => <span className={screen === step ? 'active' : ''} key={step} />)}</div>
      {toast && <div className="toast" role="status" data-testid="status-feedback">{toast}</div>}
      {modal && <div className="modal-backdrop" role="presentation" onClick={() => setModal(null)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button" aria-label="Close dialog" data-testid="button-close-modal" style={{ float: 'right' }} onClick={() => setModal(null)}><X size={19} /></button>
        {modal === 'off' ? <><h2 id="modal-title">Turn off Catch-Up Pass?</h2><p>You can still post on time. You just won’t get a pass when you miss a drop. You can turn it back on here anytime.</p><div className="modal-actions"><button className="secondary-btn" data-testid="button-cancel-opt-out" onClick={() => setModal(null)}>Keep it on</button><button className="primary-btn" data-testid="button-confirm-opt-out" onClick={() => { updatePreference('enabled', false); setModal(null); setScreen(1); }}>Turn it off</button></div></> :
          <><h2 id="modal-title">A softer landing for missed drops.</h2><p>Your Catch-Up Pass lets you share one honest late moment today. The post wears a Catch-Up badge, friends know it was late, and tomorrow your pass resets at midnight.</p><div className="modal-actions" style={{ gridTemplateColumns: '1fr' }}><button className="primary-btn" data-testid="button-close-how" onClick={() => setModal(null)}>Got it</button></div></>}
      </div></div>}
    </div>
  </main>;
}

function FeedPost({ name, late, own = false, caption = '', reaction, onReact, badge }: { name: string; late: string; own?: boolean; caption?: string; reaction: string | null; onReact: () => void; badge: boolean }) {
  return <article className="feed-post" data-testid={`feed-post-${name.toLowerCase()}`}>
    <div className="feed-post-head"><span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span className="avatar" style={{ width: 30, height: 30, background: own ? '#282a26' : '#e6e4dd', color: own ? 'white' : '#67675f', fontSize: 12 }}>{name[0]}</span>{name}</span><span className="quiet" style={{ fontSize: 11 }}>{late}</span></div>
    <div className={`photo-placeholder feed-photo ${own ? 'feed-own' : ''}`}><div className="camera-main-label" style={{ color: '#74746d' }}>{own ? 'Your moment' : `${name}’s moment`}</div><div className="camera-inset" style={{ width: 78, height: 98, left: 12, bottom: 12, fontSize: 9 }}>Rear camera</div>{badge && <div className="pill" style={{ position: 'absolute', zIndex: 1, right: 12, top: 12, background: '#292a26dc', color: 'white', fontSize: 9 }}>Catch-Up · Today</div>}</div>
    {caption && <div className="post-caption">{caption}</div>}
    <button className="feed-reactions" data-testid={`button-react-${name.toLowerCase()}`} onClick={onReact} style={{ background: 'transparent', border: 0, cursor: 'pointer', font: 'inherit' }}><span className="pill" style={{ background: '#f2f1ed', fontSize: 14, padding: '5px 10px' }}>{reaction ?? (own ? '😂  ❤️' : '😲  👎')}</span><span>{reaction ? 'Reacted · tap to undo' : 'Add a reaction'}</span></button>
    {own && <div className="microcopy" style={{ textAlign: 'left', paddingLeft: 2 }}>Visible to friends</div>}
  </article>;
}

export default App;

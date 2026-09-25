import { useEffect, useState } from 'react'
import { SIGN_IN, APP_URL } from '../lib/app.js'

const copy = {
  en: { back: 'Back to the entrance', title: 'A place for everything.', intro: 'The service is your front door. These are the rooms behind it. Existing accounts and access stay where they are.', language: 'Language', rooms: [
    ['Studio services', 'Discover the diagnostic, implementation and ongoing service for your creative practice.', [['Explore the service', '/#services']]],
    ['Your Client Suite', 'Your published reports, service requests and billing documents. Sign in with the account invited to your client workspace.', [['Client Suite', `${APP_URL}/client`], ['Sign in', SIGN_IN]]],
    ['Personal & household', 'The existing home for Amber, Kevin and household services. Your existing links and account access still work.', [['Personal services', '/personal'], ['Your Roster', SIGN_IN]]],
    ['Parti & Pepper', 'The studio operating system and ERP assistant sit within your agreed service. Existing clients continue using their own studio’s ERP address.', [['See the workflows', '/#inside']]],
  ], note: 'Your workspace is governed by your account permissions. This directory does not grant access to another client’s records.' },
  'zh-Hans': { back: '返回入口', title: '每件事，都有它的位置。', intro: '服务是入口，这里是通往各个空间的门。现有账户与访问权限保持不变。', language: '语言', rooms: [
    ['工作室服务', '了解面向创意团队的诊断、实施与持续服务。', [['了解服务', '/#services']]],
    ['你的客户 Suite', '已发布报告、服务需求与账单文件。请使用获邀进入客户空间的账户登录。', [['客户 Suite', `${APP_URL}/client`], ['登录', SIGN_IN]]],
    ['个人与家庭', 'Amber、Kevin 与家庭服务的现有空间。原有链接与账户仍可使用。', [['个人服务', '/personal'], ['你的 Roster', SIGN_IN]]],
    ['Parti 与 Pepper', '工作室运营系统与 ERP 助手属于约定的服务范围。现有客户继续使用自己工作室的 ERP 地址。', [['查看流程', '/#inside']]],
  ], note: '账户权限决定可访问的工作空间。此目录不会授予其他客户资料的访问权。' },
  'zh-Hant': { back: '返回入口', title: '每件事，都有它的位置。', intro: '服務是入口，這裡是通往各個空間的門。現有帳戶與存取權限保持不變。', language: '語言', rooms: [
    ['工作室服務', '了解面向創意團隊的診斷、實施與持續服務。', [['了解服務', '/#services']]],
    ['你的客戶 Suite', '已發布報告、服務需求與帳單文件。請使用獲邀進入客戶空間的帳戶登入。', [['客戶 Suite', `${APP_URL}/client`], ['登入', SIGN_IN]]],
    ['個人與家庭', 'Amber、Kevin 與家庭服務的現有空間。原有連結與帳戶仍可使用。', [['個人服務', '/personal'], ['你的 Roster', SIGN_IN]]],
    ['Parti 與 Pepper', '工作室營運系統與 ERP 助手屬於約定的服務範圍。現有客戶繼續使用自己工作室的 ERP 位址。', [['查看流程', '/#inside']]],
  ], note: '帳戶權限決定可存取的工作空間。此目錄不會授予其他客戶資料的存取權。' },
}
export default function Rooms() {
  const [lang, setLang] = useState(() => { try { return copy[localStorage.getItem('roster-public-language-v1')] ? localStorage.getItem('roster-public-language-v1') : 'en' } catch { return 'en' } })
  const c = copy[lang]
  useEffect(() => { document.documentElement.lang = lang; document.title = `${c.title} — The Roster`; try { localStorage.setItem('roster-public-language-v1', lang) } catch { /* Optional preference */ } }, [lang, c])
  return <div className="studio-site"><header className="studio-header"><a href="/" className="studio-wordmark">The <em>Roster</em></a><nav className="open" aria-label={c.back}><a href="/">{c.back}</a></nav><label className="studio-language"><select aria-label={c.language} value={lang} onChange={e => setLang(e.target.value)}><option value="en">EN</option><option value="zh-Hans">简体</option><option value="zh-Hant">繁體</option></select></label></header><main className="studio-container studio-section studio-rooms"><h1>{c.title}</h1><p>{c.intro}</p><div className="studio-room-grid">{c.rooms.map(([title, body, links]) => <article key={title}><h2>{title}</h2><p>{body}</p>{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</article>)}</div><p className="studio-scope-note">{c.note}</p></main></div>
}

/**
 * Templates remount on every navigation, so the CSS `screen-enter` animation
 * replays each time a new screen slides in (only after client-side navigation,
 * so the first paint is never delayed).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="screen-enter">{children}</div>;
}

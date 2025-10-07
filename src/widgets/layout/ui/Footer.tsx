import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer footer-horizontal sm:footer-horizontal bg-base-200 text-base-content px-4 py-6 mt-auto">
      <aside>
        <p className="text-sm">© {new Date().getFullYear()} DevNest. All rights reserved.</p>
      </aside>
      <nav>
        <h6 className="footer-title">사이트</h6>
        <Link className="link link-hover" href="/about">
          소개
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">소셜</h6>
        <Link className="link link-hover" href="https://github.com" target="_blank">
          GitHub
        </Link>
        <Link className="link link-hover" href="https://linkedin.com" target="_blank">
          LinkedIn
        </Link>
      </nav>
    </footer>
  );
}

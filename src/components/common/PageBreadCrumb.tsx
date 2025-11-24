import { Link } from "react-router";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
      <h2 style={{ color: 'black', fontSize: '20px', fontWeight: '600' }}>
        {pageTitle}
      </h2>
      <nav>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <li>
            <Link
              style={{ color: 'black', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              to="/"
            >
              Home
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="black"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li style={{ color: 'black', fontSize: '14px' }}>
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;

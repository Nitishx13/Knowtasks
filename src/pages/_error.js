function Error({ statusCode }) {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', color: '#dc3545' }}>
          {statusCode ? statusCode : 'Client Error'}
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d', margin: '0 0 30px 0' }}>
          {statusCode === 404
            ? 'This page could not be found.'
            : statusCode
            ? `A server error ${statusCode} occurred.`
            : 'An error occurred on client side.'}
        </p>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

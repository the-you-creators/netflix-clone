import type { Component } from 'solid-js';
import { AdminPanel } from '@/components/AdminPanel';

export const Admin: Component = () => {
  return (
    <div class="admin-page">
      <header class="admin-header">
        <h1 class="logo">NETFLIX CLONE - 管理画面</h1>
        <nav class="nav-menu">
          <a href="/" class="nav-link">ホーム</a>
          <a href="/admin" class="nav-link active">管理</a>
        </nav>
      </header>

      <main class="admin-main">
        <div class="admin-container">
          <AdminPanel />
        </div>
      </main>

      <footer class="admin-footer">
        <p>&copy; 2024 Netflix Clone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export const adminStyles = `
  .admin-page {
    min-height: 100vh;
    background: #141414;
    display: flex;
    flex-direction: column;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: rgba(0, 0, 0, 0.7);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }

  .admin-header .logo {
    color: #e50914;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    letter-spacing: -1px;
  }

  .admin-header .nav-menu {
    display: flex;
    gap: 30px;
  }

  .admin-header .nav-link {
    color: #999;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s;
  }

  .admin-header .nav-link:hover,
  .admin-header .nav-link.active {
    color: white;
  }

  .admin-main {
    flex: 1;
    padding: 40px 20px;
  }

  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .admin-footer {
    padding: 20px;
    text-align: center;
    color: #666;
    font-size: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    .admin-header {
      padding: 15px 20px;
      flex-direction: column;
      gap: 15px;
    }

    .admin-header .logo {
      font-size: 20px;
    }

    .admin-header .nav-menu {
      gap: 20px;
    }

    .admin-main {
      padding: 20px 10px;
    }
  }
`;
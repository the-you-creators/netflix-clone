import type { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { Home } from '@/pages/Home';
import { VideoDetail } from '@/pages/VideoDetail';
import { Admin } from '@/pages/Admin';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/video/:id" component={VideoDetail} />
      <Route path="/admin" component={Admin} />
    </Router>
  );
};

export default App;
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LikedPodcasts from "@/pages/liked";
import { MiniPlayer } from "@/components/MiniPlayer";
import { useAudioStore } from "@/lib/store";
import { useEffect } from "react";

function Router() {
  return (
    <main className="min-h-screen pb-24 relative z-10">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/liked" component={LikedPodcasts} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

function App() {
  const initAudio = useAudioStore(state => state.initAudio);

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-background text-foreground antialiased">
        <Router />
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MiniPlayer />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
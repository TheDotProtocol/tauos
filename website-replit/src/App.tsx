import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import DownloadPage from "@/pages/DownloadPage";
import NotFound from "@/pages/not-found";
import DocViewerPage from "@/pages/DocViewerPage";
import HtmlLegalPage from "@/pages/HtmlLegalPage";
import Cursor from "@/components/Cursor";
import {
  AboutPage,
  BetaPage,
  DevelopersPage,
  GovernancePage,
  ContactPage,
  LegalPage,
  PrivacyPage,
  DocsPage,
  TauScriptPage,
} from "@/pages/LegacyPages";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Cursor />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/beta" element={<BetaPage />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/:slug" element={<DocViewerPage />} />
            <Route path="/tauscript" element={<TauScriptPage />} />
            <Route
              path="/legal/security-whitepaper"
              element={
                <HtmlLegalPage
                  title="Security Whitepaper"
                  src="/documents/legal/tauos-security-whitepaper.html"
                />
              }
            />
            <Route
              path="/legal/data-protection"
              element={
                <HtmlLegalPage
                  title="Data Protection Addendum"
                  src="/documents/legal/tauos-data-protection-addendum.html"
                />
              }
            />
            <Route
              path="/legal/sub-processors"
              element={
                <HtmlLegalPage
                  title="Sub-processors"
                  src="/documents/legal/tauos-sub-processor-list.html"
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

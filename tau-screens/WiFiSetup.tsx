import React, { useState, useEffect } from 'react';
import { Button } from '../tau-components/Button';
import { Input } from '../tau-components/Input';

interface WiFiNetwork {
  ssid: string;
  signal: number;
  security: 'open' | 'wep' | 'wpa' | 'wpa2' | 'wpa3';
  connected: boolean;
}

const WiFiSetup: React.FC = () => {
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');

  // Simulate network scanning
  useEffect(() => {
    const scanNetworks = () => {
      setIsScanning(true);
      setTimeout(() => {
        setNetworks([
          { ssid: 'TauCore_Office', signal: 85, security: 'wpa2', connected: false },
          { ssid: 'Home_WiFi', signal: 92, security: 'wpa3', connected: false },
          { ssid: 'CoffeeShop_Guest', signal: 45, security: 'open', connected: false },
          { ssid: 'Neighbor_5G', signal: 38, security: 'wpa2', connected: false },
          { ssid: 'TauCore_Dev', signal: 78, security: 'wpa2', connected: false },
        ]);
        setIsScanning(false);
      }, 2000);
    };

    scanNetworks();
  }, []);

  const handleConnect = async () => {
    if (!selectedNetwork) return;

    setIsConnecting(true);
    setConnectionStatus('connecting');

    // Simulate connection process
    setTimeout(() => {
      if (selectedNetwork.security === 'open' || password.length >= 8) {
        setConnectionStatus('connected');
        setNetworks(prev => prev.map(net => 
          net.ssid === selectedNetwork.ssid ? { ...net, connected: true } : net
        ));
      } else {
        setConnectionStatus('failed');
      }
      setIsConnecting(false);
    }, 3000);
  };

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'open':
        return '🔓';
      case 'wep':
        return '🔒';
      case 'wpa':
      case 'wpa2':
      case 'wpa3':
        return '🔐';
      default:
        return '🔒';
    }
  };

  const getSignalStrength = (signal: number) => {
    if (signal >= 80) return '📶';
    if (signal >= 60) return '📶';
    if (signal >= 40) return '📶';
    return '📶';
  };

  return (
    <div className="min-h-screen bg-tau-bg-primary flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-tau-white-primary mb-2">
            Connect to Wi-Fi
          </h1>
          <p className="text-tau-gray-400">
            Select a network to connect to the internet
          </p>
        </div>

        {/* Network List */}
        <div className="bg-tau-bg-surface rounded-lg border border-tau-gray-600 mb-6">
          <div className="p-4 border-b border-tau-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-semibold text-tau-white-primary">
                Available Networks
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                disabled={isScanning}
              >
                {isScanning ? 'Scanning...' : 'Refresh'}
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isScanning ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-tau-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-tau-gray-400">Scanning for networks...</p>
              </div>
            ) : (
              networks.map((network, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedNetwork(network)}
                  className={`w-full px-4 py-3 text-left hover:bg-tau-gray-800 transition-colors border-b border-tau-gray-700 last:border-b-0 ${
                    selectedNetwork?.ssid === network.ssid 
                      ? 'bg-tau-gold-500 bg-opacity-10 border-l-4 border-l-tau-gold-500' 
                      : ''
                  } ${network.connected ? 'bg-green-500 bg-opacity-10' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getSecurityIcon(network.security)}</span>
                      <div>
                        <div className="text-tau-white-primary font-medium">
                          {network.ssid}
                        </div>
                        <div className="text-tau-gray-400 text-sm">
                          {network.security.toUpperCase()} • {network.signal}% signal
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSignalStrength(network.signal)}</span>
                      {network.connected && (
                        <span className="text-green-500 text-sm">Connected</span>
                      )}
                      {selectedNetwork?.ssid === network.ssid && (
                        <svg className="w-5 h-5 text-tau-gold-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Password Input */}
        {selectedNetwork && selectedNetwork.security !== 'open' && (
          <div className="mb-6">
            <Input
              label="Network Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Wi-Fi password"
              helperText="Enter the password for the selected network"
            />
          </div>
        )}

        {/* Connection Status */}
        {connectionStatus !== 'disconnected' && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${
              connectionStatus === 'connected' 
                ? 'bg-green-500 bg-opacity-10 border-green-500 text-green-400'
                : connectionStatus === 'connecting'
                ? 'bg-tau-gold-500 bg-opacity-10 border-tau-gold-500 text-tau-gold-400'
                : 'bg-red-500 bg-opacity-10 border-red-500 text-red-400'
            }`}>
              <div className="flex items-center space-x-2">
                {connectionStatus === 'connecting' && (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                )}
                {connectionStatus === 'connected' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {connectionStatus === 'failed' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                <span>
                  {connectionStatus === 'connecting' && 'Connecting to network...'}
                  {connectionStatus === 'connected' && 'Successfully connected!'}
                  {connectionStatus === 'failed' && 'Connection failed. Please check your password.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button variant="secondary" className="flex-1">
            Skip
          </Button>
          <Button 
            variant="primary" 
            className="flex-1"
            onClick={handleConnect}
            disabled={!selectedNetwork || (selectedNetwork.security !== 'open' && !password) || isConnecting}
            loading={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WiFiSetup;

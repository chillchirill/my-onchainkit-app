'use client';

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownBasename, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';

export default function WalletConnect() {
  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-ock-foreground">Connect Wallet</div>
          </div>
        </ConnectWallet>
        <WalletDropdown>
          <WalletDropdownBasename />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}

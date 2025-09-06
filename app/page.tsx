// 'use client';


// import {
//   Address,
//   Avatar,
//   Name,
//   Identity,
//   EthBalance,
// } from '@coinbase/onchainkit/identity';
// import ArrowSvg from './svg/ArrowSvg';
// import ImageSvg from './svg/Image';
// import OnchainkitSvg from './svg/OnchainKit';
// // import { useWalletClient } from 'wagmi';

// const components = [
//   {
//     name: 'Transaction',
//     url: 'https://onchainkit.xyz/transaction/transaction',
//   },
//   { name: 'Swap', url: 'https://onchainkit.xyz/swap/swap' },
//   { name: 'Checkout', url: 'https://onchainkit.xyz/checkout/checkout' },
//   { name: 'Wallet', url: 'https://onchainkit.xyz/wallet/wallet' },
//   { name: 'Identity', url: 'https://onchainkit.xyz/identity/identity' },
// ];

// const templates = [
//   { name: 'NFT', url: 'https://github.com/coinbase/onchain-app-template' },
//   { name: 'Commerce', url: 'https://github.com/coinbase/onchain-commerce-template'},
//   { name: 'Fund', url: 'https://github.com/fakepixels/fund-component' },
// ];

// export default function App() {
//   return (
//     <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
//       <header className="pt-4 pr-4">
//         <div className="flex justify-end">
//           <div className="wallet-container">
//             <Wallet>
//               <ConnectWallet>
//                 <Avatar className="h-6 w-6" />
//                 <Name />
//               </ConnectWallet>
//               <WalletDropdown>
//                 <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
//                   <Avatar />
//                   <Name />
//                   <Address />
//                   <EthBalance />
//                 </Identity>
//                 <WalletDropdownLink
//                   icon="wallet"
//                   href="https://keys.coinbase.com"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Wallet
//                 </WalletDropdownLink>
//                 <WalletDropdownDisconnect />
//               </WalletDropdown>
//             </Wallet>
//           </div>
//         </div>
//       </header>

//       <main className="flex-grow flex items-center justify-center">
//         <div className="max-w-4xl w-full p-4">
//           <div className="w-1/3 mx-auto mb-6">
//             <ImageSvg />
//           </div>
//           <div className="flex justify-center mb-6">
//             <a target="_blank" rel="_template" href="https://onchainkit.xyz">
//               <OnchainkitSvg className="dark:text-white text-black" />
//             </a>
//           </div>
//           <p className="text-center mb-6">
//             Get started by editing
//             <code className="p-1 ml-1 rounded dark:bg-gray-800 bg-gray-200">app/page.tsx</code>.
//           </p>
//           <div className="flex flex-col items-center">
//             <div className="max-w-2xl w-full">
//               <div className="flex flex-col md:flex-row justify-between mt-4">
//                 <div className="md:w-1/2 mb-4 md:mb-0 flex flex-col items-center">
//                   <p className="font-semibold mb-2 text-center">
//                     Explore components
//                   </p>
//                   <ul className="list-disc pl-5 space-y-2 inline-block text-left">
//                     {components.map((component, index) => (
//                       <li key={index}>
//                         <a
//                           href={component.url}
//                           className="hover:underline inline-flex items-center dark:text-white text-black"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {component.name}
//                           <ArrowSvg />
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="md:w-1/2 flex flex-col items-center">
//                   <p className="font-semibold mb-2 text-center">
//                     Explore templates
//                   </p>
//                   <ul className="list-disc pl-5 space-y-2 inline-block text-left">
//                     {templates.map((template, index) => (
//                       <li key={index}>
//                         <a
//                           href={template.url}
//                           className="hover:underline inline-flex items-center dark:text-white text-black"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {template.name}
//                           <ArrowSvg/>
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



'use client';
import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
// import {
//   ConnectWallet,
//   Wallet,
//   WalletDropdown,
//   WalletDropdownLink,
//   WalletDropdownDisconnect,
// } from '@coinbase/onchainkit/wallet';
// import {
//   Address,
//   Avatar,
//   Name,
//   Identity,
//   EthBalance,
// } from '@coinbase/onchainkit/identity';
import './main.css';

import Game from "@/app/components/Game";
import "./globals.css";
import Header from "@/app/components/Header";
import NewGame from "@/app/components/NewGame";
import Controls from "@/app/components/Controls";
import { useWeb3 } from './contexts/Web3Context';
import GameInfo from './types/GameInfo';

function Home() {
  const { getGames, isConnected, contract, switchNetwork } = useWeb3();

  const [games, setGames] = useState<GameInfo[]>([]);

  useEffect(() => {
    if (!isConnected) return;
    switchNetwork('eth-sepolia');
  }, [isConnected]);

  useEffect(() => {
		if (!contract) return;

		const fetchGames = async () => {
			const gamesList = await getGames();
			setGames(gamesList);
		};

		fetchGames();
	}, [getGames, contract]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading... (If you are using PC, please connect your wallet)</div>
      </div>
    );
  }

  contract.on("GameStep", async () => {
    const gamesList = await getGames();
    setGames(gamesList);
  });

  return (
    <>
      <Header />
      <Controls />
      <NewGame />
      {games.map((game, index) => (
        <Game key={index} game={game} showMoreInfoButton={true} />
      ))}
    </>
  );
}

export default function HomePage() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return (<div>
    {/* <header className="pt-4 pr-4"> */}
    {/* <header className="">
      <div className="flex justify-end pr-4">
        <div className="wallet-container pt-2">
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>
    </header> */}
    <>
      <Home />
    </>
  </div>);
}

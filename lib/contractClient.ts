// lib/contractClient.ts
import { ethers, Contract, providers } from "ethers";

const CONTRACT_ABI = [ /* your smart contract ABI here */ ];
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

let provider: providers.Web3Provider | null = null;
let signer: ethers.Signer | null = null;
let contract: Contract | null = null;

export function getProvider() {
  if (!provider) {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      provider = new ethers.providers.Web3Provider((window as any).ethereum);
    } else {
      // fallback to public provider (e.g., Infura)
      provider = ethers.getDefaultProvider("homestead");
    }
  }
  return provider;
}

export async function connectWallet() {
  if (!provider) getProvider();
  if (!provider) throw new Error("No Ethereum provider found");

  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return signer;
}

export function getContract() {
  if (!contract) {
    const p = getProvider();
    contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, p);
  }
  return contract;
}

// Read-only call example
export async function getSomeValue(): Promise<string> {
  const c = getContract();
  return await c.someViewMethod();
}

// Write method example: trigger buy
export async function triggerBuy(amount: string): Promise<ethers.providers.TransactionResponse> {
  if (!signer) throw new Error("Wallet not connected");
  const c = getContract().connect(signer);
  const tx = await c.buy({ value: ethers.utils.parseEther(amount) });
  return tx;
}

// Wait for transaction confirmation
export async function waitForTx(tx: ethers.providers.TransactionResponse) {
  return await tx.wait();
}

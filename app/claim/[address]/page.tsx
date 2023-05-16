import { UserClaim } from "@/components/user-claim";

export default function Home({ params }: { params: { address: string } }) {
  return (
    <div>
      <div className="relative z-10 flex h-screen w-full items-center justify-center">
        <div className="shadow-me relative flex w-[42rem] flex-col items-start overflow-hidden rounded-lg bg-dark p-2">
          <div className="relative flex h-full w-full flex-col justify-between p-4">
            <UserClaim lootAddress={params.address} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/Button";

export default function ProfileHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">User Information</h1>
        <p className="text-sm text-muted-foreground">
          Update your profile details below.
        </p>
      </div>
      <Button className="bg-blue-600 text-white">Confirm</Button>
    </div>
  );
}

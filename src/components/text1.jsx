import { Progress } from "@material-tailwind/react";
 
export function ProgressDefault() {
  return <Progress value={50} />;
}
export function Text() {

  return (
    <div className="max-w-screen-xl mx-auto pr-6 py-12 flex items-center gap-10 pt-24">
      <div className="w-1/2">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Mendorong Penelitian dan Pengabdian
        </h1>
      </div>
    </div>
  );
}
import { Card, CardBody, Typography } from "@material-tailwind/react";

export default function PengurusCard({ name, role, institution, image }) {
  return (
    <Card className="rounded-xl shadow-md">
      
      <img
        src={image}
        alt={name}
      />

      <CardBody className="text-center">
        
        <Typography variant="h6" className="font-semibold">
          {name}
        </Typography>

        <Typography className="text-sm text-gray-600">
          {role}
        </Typography>

        <Typography className="text-xs text-gray-500">
          {institution}
        </Typography>

      </CardBody>

    </Card>
  );
}
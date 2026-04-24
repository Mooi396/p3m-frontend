import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
} from "@material-tailwind/react";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function FeaturedCard({ article }) {
  return (
    <Card className="w-full flex-row overflow-hidden shadow-md">
      <CardHeader shadow={false} floated={false} className="m-0 w-2/5 shrink-0 rounded-r-none">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
      </CardHeader>
      <CardBody className="flex flex-col justify-center p-8">
        <Typography variant="h4" color="blue-gray" className="mb-3 font-bold leading-snug">
          {article.title}
        </Typography>
        <Typography variant="paragraph" color="gray" className="mb-6 font-normal leading-relaxed">
          {article.description}
        </Typography>
        <div className="flex items-center gap-2 mb-6">
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=1e293b&color=fff&size=32`}
            alt={article.author}
            size="xs"
          />
          <Typography variant="small" color="gray" className="font-medium">{article.author}</Typography>
          <span className="text-blue-gray-200 text-xs">•</span>
          <Typography variant="small" color="gray" className="font-normal">{article.date}</Typography>
        </div>
        <Button variant="filled" color="black" className="flex items-center gap-2 w-fit" size="sm">
          Baca Selengkapnya
          <ArrowRightIcon />
        </Button>
      </CardBody>
    </Card>
  );
}
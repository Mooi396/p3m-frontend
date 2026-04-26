import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  Chip,
} from "@material-tailwind/react";

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function ArticleCard({ article }) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardHeader shadow={false} floated={false} className="m-0 h-48 rounded-b-none">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
      </CardHeader>
      <CardBody className="p-5">
        <Chip value={article.date} size="sm" variant="ghost" color="blue-gray" className="mb-3 w-fit text-xs px-0 font-normal" />
        <Typography variant="h6" color="blue-gray" className="mb-4 font-bold leading-snug line-clamp-3">
          {article.title}
        </Typography>
        <div className="flex items-center gap-2 mb-4">
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=1e293b&color=fff&size=32`}
            alt={article.author}
            size="xs"
          />
          <Typography variant="small" color="gray" className="font-medium">{article.author}</Typography>
        </div>
        <Button variant="text" color="black" className="flex items-center gap-1 p-0 font-semibold text-sm" size="sm">
          Baca Selengkapnya
          <ArrowRightIcon />
        </Button>
      </CardBody>
    </Card>
  );
}
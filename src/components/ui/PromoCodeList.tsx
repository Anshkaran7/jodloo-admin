import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

const PromoCodeTable: React.FC<{ promoCodes: any[] }> = ({ promoCodes }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Promo Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Influencer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promoCodes.map((promoCode, index) => (
          <TableRow key={index}>
            <TableCell>{promoCode.code}</TableCell>
            <TableCell>{promoCode.discount}%</TableCell>
            <TableCell>{promoCode.influencer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PromoCodeTable;

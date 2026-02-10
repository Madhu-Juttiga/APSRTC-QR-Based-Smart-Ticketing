import RouteSelect from "./RouteSelect";

export default function NormalTicket({ onDone }) {
  return (
    <RouteSelect
      ticketType="NORMAL"
      qrValue={null}
      onDone={onDone}
    />
  );
}

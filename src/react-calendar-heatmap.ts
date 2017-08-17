declare module "react-calendar-heatmap" {

    export interface Record {
        date: string | Date;
        count: number;
    }

    export interface CalendarHeatmapProps {
        endDate: Date;
        numDays: number;
        values: Record[];
        classForValue(record: Record): string;
    }

    export default class CalendarHeatmap extends React.Component<CalendarHeatmapProps> { }
}

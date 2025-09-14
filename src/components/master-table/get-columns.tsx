"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import { MoreHorizontal } from "lucide-react";
import { invokeActionClickHandler } from "@/lib/utils";

const text_render = (column: any, details: any) => {
    return (
        details?.options?.value_type == "array" ?
            column?.row?.getValue(details?.field).join(", ") :

            details?.options?.value_type == "date" ?

                formatDate(column?.row?.getValue(details?.field))
                : column?.row?.getValue(details?.field))
}

const get_simple_text = (column: any, details: any) => {
    return (
        <div className="w-20">
            {text_render(column, details)}
        </div>
    )
}

const get_text_size_config = (column: any, details: any) => {
    return (

        <span className={`max-w-[31.25rem] truncate font-${details?.options?.text_size}`}>
            {text_render(column, details)}
        </span>
    )
}

const get_label_field_config = (column: any, details: any) => {
    return (
        details?.options?.lable_fields?.map((lable: any) => {
            return <Badge variant="outline" key={lable}>{column?.row?.getValue(lable)}</Badge>
        })
    )
}

// const get_render = (column: any, details: any) => {
//     const { options } = details;
//     const {
//         is_longtext,
//         icons,
//         text_size,
//         lable_fields,
//         is_switch,
//         switch_value,
//         on_click_id,
//         on_change_id,
//     } = options;

//     const row = column.row;
//     const fieldValue = row.getValue(details.field);
//     const isSwitchChecked = fieldValue == switch_value;

//     let simple_render = get_simple_text(column, details);
//     let lable_render;
//     let icon_render;
//     let switch_render;

//     if (lable_fields && lable_fields.length > 0) {
//         lable_render = get_label_field_config(column, details);
//     }

//     if (is_switch) {
//         switch_render = (
//             <Switch
//                 id={details.field}
//                 checked={isSwitchChecked}
//                 onCheckedChange={(value) => {
//                     if (on_change_id) {
//                         invokeTableActionHandler(on_change_id, value, row);
//                     }
//                 }}
//             />
//         );
//     }

//     if (icons) {
//         const Icon = icons[fieldValue] || icons["primary"];
//         icon_render = <Icon className="py-1 [&>svg]:size-3.5" />;
//     }

//     const logtext_class = is_longtext ? "max-w-[31.25rem] truncate font-medium" : "";

//     return (
//         <div className={`flex items-center gap-2 ${logtext_class}`} key={column.id}>
//             {lable_render}
//             {icon_render}
//             {switch_render}
//             {on_click_id ? (
//                 <span
//                     onClick={() => invokeTableActionHandler(on_click_id, fieldValue, row)}
//                     className="cursor-pointer"
//                 >
//                     {text_size != null ? get_text_size_config(column, details) : simple_render}
//                 </span>
//             ) : (
//                 text_size != null ? get_text_size_config(column, details) : simple_render
//             )}
//         </div>
//     );
// };

export function get_columns(columnConfigs: any, tableConfig: any, columnActions: any) {
    const { selectAll, actionColumn } = tableConfig;
    columnConfigs = columnConfigs.sort((a: any, b: any) => a?.options?.index - b?.options?.index);
    let columns = columnConfigs

    if (selectAll) {
        columns = [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="translate-y-0.5"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
                size: 40,
            },
            ...columns
        ]
    }

    if (actionColumn) {
        columns = [
            ...columns,
            {
                id: "actions",
                cell: function Cell(details) {
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {
                                    columnActions.map((item) => {
                                        return <DropdownMenuItem key={item?.title} onClick={() => invokeActionClickHandler(item?.type, details?.row)} variant={item?.title?.toLowerCase() == 'delete' ? 'destructive' : 'default'} >{item?.title}</DropdownMenuItem>
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
                size: 32,
            },

        ]
    }
    return columns;
}

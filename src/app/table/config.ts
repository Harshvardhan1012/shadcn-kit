import {
    Award,
    Download,
    User,
} from "lucide-react";

export const columnConfig = [
    {
        "field": "progress_activity",
        "title": "Progress Activity",
        "options": {
            "type": "text",
            "is_longtext": true,
            "on_click_id": "progress_activity",
            "on_change_id": "is_active",
            "icons": null,
            "index": 2
        },
    },
    {
        "field": "is_active",
        "title": "Active",
        "options": {
            "type": "boolean",
            "value_type": "boolean",
            "is_switch": true,
            "switch_value": true,
            "icons": null,
            "index": 7,
            "on_change_id": "is_active"
        }
    },
    {
        "field": "created_by",
        "title": "Created By",
        "options": {
            "type": "text",
            "icons": {
                "primary": User,
            },
            "index": 8
        }
    },
    {
        "field": "created_at",
        "title": "Created At",
        "options": {
            "type": "dateRange",
            "value_type": "date",
            "icons": null,
            "index": 9
        }
    },
    {
        "field": "updated_at",
        "title": "Updated At",
        "options": {
            "type": "dateRange",
            "value_type": "date",
            "icons": null,
            "index": 10
        }
    }
]

export const tableConfig = {
    selectAll: true,
    actionColumn: true
}

export const data = [
    {
        "id": "e8a1f6dc-6c7f-4b2d-9f47-d62c48c5e3b1",
        "progress_activity": "Site Preparation",
        "is_active": true,
        "created_by": "user_123",
        "created_at": "2025-06-23T10:36:00Z",
        "updated_by": "user_456",
        "updated_at": "2025-06-23T10:36:00Z"
    },
    {
        "id": "b0c23d8e-2f58-4c2e-a678-45b1dd8231ef",
        "progress_activity": "Foundation Construction",
        "is_active": false,
        "created_by": "user_789",
        "created_at": "2025-05-15T08:22:00Z",
        "updated_by": "user_123",
        "updated_at": "2025-06-01T14:00:00Z",
    },
    {
        "id": "f93ecdf7-a3c6-4f9e-b0ea-1ec6f0d4a811",
        "progress_activity": "Structural Framing",
        "is_active": true,
        "created_by": "user_222",
        "created_at": "2025-07-01T12:00:00Z",
        "updated_by": "user_222",
        "updated_at": "2025-07-10T16:30:00Z",
    },
    {
        "id": "a1b2c3d4-e5f6-7890-abcd-1234567890aa",
        "progress_activity": "Electrical Installation",
        "is_active": false,
        "created_by": "user_019",
        "created_at": "2025-07-21T22:34:06.366808Z",
        "updated_by": "user_018",
        "updated_at": "2025-07-21T22:34:06.366808Z",
    },
    {
        "id": "b2c3d4e5-f6a7-8901-bcde-2345678901bb",
        "progress_activity": "Plumbing Setup",
        "is_active": false,
        "created_by": "user_007",
        "created_at": "2025-05-25T01:06:06.367039Z",
        "updated_by": "user_018",
        "updated_at": "2025-06-21T04:04:06.367064Z",
    },
    {
        "id": "c3d4e5f6-a7b8-9012-cdef-3456789012cc",
        "progress_activity": "Equipment Testing",
        "is_active": true,
        "created_by": "user_019",
        "created_at": "2025-06-28T14:25:06.367179Z",
        "updated_by": "user_005",
        "updated_at": "2025-07-02T00:03:06.367202Z",
    },
    {
        "id": "d4e5f6a7-b8c9-0123-def0-4567890123dd",
        "progress_activity": "Wiered Installation",
        "is_active": false,
        "created_by": "user_007",
        "created_at": "2025-07-08T19:12:06.367274Z",
        "updated_by": "user_002",
        "updated_at": "2025-07-08T19:12:06.367274Z",
    },
    {
        "id": "e5f6a7b8-c9d0-1234-ef01-5678901234ee",
        "progress_activity": "Data Setup",
        "is_active": true,
        "created_by": "user_007",
        "created_at": "2025-07-07T07:02:06.367327Z",
        "updated_by": "user_015",
        "updated_at": "2025-07-07T07:02:06.367327Z"
    },
    {
        "id": "e5f6a7b8-c9d0-1234-ef01-5678901234e1",
        "progress_activity": "IoT Installation",
        "is_active": true,
        "created_by": "user_007",
        "created_at": "2025-07-07T07:02:06.367327Z",
        "updated_by": "user_015",
        "updated_at": "2025-07-07T07:02:06.367327Z",
    },
    {
        "id": "e5f6a7b8-c9d0-1234-ef01-5678901234e2",
        "progress_activity": "Fermware Setup",
        "is_active": true,
        "created_by": "user_007",
        "created_at": "2025-07-07T07:02:06.367327Z",
        "updated_by": "user_015",
        "updated_at": "2025-07-07T07:02:06.367327Z",
    },
    {
        "id": "e5f6a7b8-c9d0-1234-ef01-5678901234e3",
        "progress_activity": "Record Update",
        "is_active": true,
        "created_by": "user_007",
        "created_at": "2025-07-07T07:02:06.367327Z",
        "updated_by": "user_015",
        "updated_at": "2025-07-07T07:02:06.367327Z",
    },
    {
        "id": "e5f6a7b8-c9d0-1234-ef01-5678901234e4",
        "progress_activity": "Backup Existing",
        "is_active": true,
        "created_by": "user_007",
        "created_at": "2025-07-07T07:02:06.367327Z",
        "updated_by": "user_015",
        "updated_at": "2025-07-07T07:02:06.367327Z",
    },

];

export const actionConfig = [
    {
        action: "download",
        is_direct_action: true,
        icon: Download,
        tooltip: "Export Data",
        is_export: true,
        onClick: () => { }
    },
    {
        action: "change_is_active",
        is_direct_action: false,
        icon: Award,
        tooltip: "Change Active Status",
        is_field_change: true,
        field: "is_active",
        api: "some/api",
        values: [
            {
                key: true,
                value: "Active"
            },
            {
                key: false,
                value: "Deactive"
            }
        ]
    }
]

export const columnActions = [
    {
        title: "Edit",
        type: "edit"
    },
    {
        title: "View",
        type: "view"
    }
]

const addItemData = {
    title: "Add Activity"
}

const datatableConfig = {
    columnConfig,
    tableConfig,
    data,
    actionConfig,
    columnActions,
    addItemData
}

export default datatableConfig;
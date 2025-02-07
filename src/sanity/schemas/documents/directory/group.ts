import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

/**
 * Group is a collection of categories
 */
export default defineType({
  name: "group",
  title: "Group",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description: "Priority of the group, used to sort the groups",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      name: "name",
      priority: "priority",
      date: "_createdAt",
    },
    prepare({ name, priority, date }) {
      const title = `${priority} - ${name}`;
      const subtitle = format(parseISO(date), "yyyy/MM/dd");
      return {
        title,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Priority",
      name: "priority",
      by: [{ field: "priority", direction: "desc" }],
    },
    {
      title: "Name",
      name: "name",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});

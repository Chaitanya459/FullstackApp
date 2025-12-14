import { format, parse, parseISO, startOfDay } from 'date-fns';
import { DocumentationDTO } from 'rsd';

const matchesDateSearch = (date: Date, search: string): boolean => {
  const dateStr = format(date, `yyyy-MM-dd`).toLowerCase();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (dateStr.includes(search)) {
    return true;
  }

  const monthPatterns = [ `MMMM`, `MMM` ];
  for (const pattern of monthPatterns) {
    const parsedDate = parse(search, pattern, new Date());
    if (!Number.isNaN(parsedDate.getTime()) && parsedDate.getMonth() === month) {
      return true;
    }
  }

  if (search === year.toString()) {
    return true;
  }

  const readableDate = format(date, `MMMM dd, yyyy`).toLowerCase();
  const shortDate = format(date, `MMM dd, yyyy`).toLowerCase();
  const slashDate = format(date, `MM/dd/yyyy`);

  return (
    readableDate.includes(search) ||
    shortDate.includes(search) ||
    slashDate.includes(search)
  );
};

export const filterDistrictNotes = (
  notes: DocumentationDTO[],
  searchTerm: string,
): DocumentationDTO[] => {
  if (!notes || notes.length === 0) {
    return [];
  }

  const trimmedSearch = searchTerm.trim();
  if (!trimmedSearch) {
    return notes;
  }

  const search = trimmedSearch.toLowerCase();

  return notes.filter((note) => {
    if (note.caseNotes?.toLowerCase().includes(search)) {
      return true;
    }

    if (note.serviceDate && matchesDateSearch(
      typeof note.serviceDate === `string` ? parseISO(note.serviceDate) : startOfDay(note.serviceDate),
      search,
    )) {
      return true;
    }

    if (note.createdAt && matchesDateSearch(new Date(note.createdAt), search)) {
      return true;
    }

    return false;
  });
};

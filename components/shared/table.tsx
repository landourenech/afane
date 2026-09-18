"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* =========================================================
   ICONS
========================================================= */

const actionIcons = {
  eye: Eye,
  pencil: Pencil,
  trash: Trash2,
} as const;

type ActionIcon = keyof typeof actionIcons;

/* =========================================================
   COLUMNS
========================================================= */

export type Column<T> = {
  key: keyof T;
  label: string;

  /**
   * URL optionnelle pour rendre
   * le contenu de la cellule cliquable.
   *
   * Exemple :
   * href: "/dashboard/admin/users/{id}"
   */
  href?: string;
};

/* =========================================================
   ACTIONS
========================================================= */

export type Action<T> = {
  label: string;

  /**
   * Nom de l'icône.
   *
   * Exemple :
   * "eye"
   * "pencil"
   * "trash"
   */
  icon?: ActionIcon;

  /**
   * Style de l'action
   */
  variant?: "default" | "destructive";

  /**
   * URL de l'action.
   *
   * {id} sera automatiquement remplacé
   * par l'identifiant de la ligne.
   */
  href?: string;
};

/* =========================================================
   PROPS
========================================================= */

interface DataTableProps<T extends Record<string, unknown>> {
  /**
   * Données du tableau
   */
  data: T[];

  /**
   * Colonnes
   */
  columns: Column<T>[];

  /**
   * Actions du menu
   */
  actions?: Action<T>[];

  /**
   * Classes CSS du tableau
   */
  className?: string;

  /**
   * Classes CSS des headers
   */
  HeadStyle?: string;

  /**
   * Propriété utilisée comme identifiant
   */
  getRowId: keyof T;

  /**
   * URL de consultation de la ligne.
   *
   * Exemple :
   * "/dashboard/admin/users/{id}"
   */
  rowHref?: string;
}

/* =========================================================
   DATA TABLE
========================================================= */

export function DataTable<T extends Record<string, unknown>>({
  data,
  className,
  columns,
  HeadStyle,
  actions = [],
  getRowId,
  rowHref,
}: DataTableProps<T>) {
  const router = useRouter();

  /**
   * Navigation vers une ligne
   */
  const handleRowClick = (item: T) => {
    if (!rowHref) return;

    const id = String(item[getRowId]);

    const href = replaceId(rowHref, id);

    router.push(href);
  };

  return (
    <div className={`${className ?? ""} w-full`}>

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden w-full overflow-x-auto md:block">

        <Table>

          {/* ================= HEADER ================= */}

          <TableHeader>

            <TableRow>

              {columns.map((column) => (

                <TableHead
                  key={String(column.key)}
                  className={HeadStyle}
                >
                  {column.label}
                </TableHead>

              ))}

              {/* ACTIONS */}

              {actions.length > 0 && (

                <TableHead
                  className={`${HeadStyle} text-right`}
                >
                  Actions
                </TableHead>

              )}

            </TableRow>

          </TableHeader>

          {/* ================= BODY ================= */}

          <TableBody>

            {data.length > 0 ? (

              data.map((item) => {

                const id = String(item[getRowId]);

                return (

                  <TableRow
                    key={id}
                    onClick={() => handleRowClick(item)}
                    className={`
                      border-b
                      border-[var(--color-secondary)]
                      transition-colors
                      ${
                        rowHref
                          ? "cursor-pointer"
                          : ""
                      }
                      hover:bg-[var(--color-secondary)]
                      hover:text-[var(--color-primary)]
                    `}
                  >

                    {/* ================= COLUMNS ================= */}

                    {columns.map((column) => {

                      const value = item[column.key];

                      return (

                        <TableCell
                          key={String(column.key)}
                        >

                          {column.href ? (

                            <Link
                              href={replaceId(
                                column.href,
                                id
                              )}
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                              className="
                                font-medium
                                hover:underline
                              "
                            >
                              {String(value ?? "-")}
                            </Link>

                          ) : (

                            String(value ?? "-")

                          )}

                        </TableCell>

                      );

                    })}

                    {/* ================= ACTIONS ================= */}

                    {actions.length > 0 && (

                      <TableCell
                        className="text-right"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >

                        <ActionsMenu
                          actions={actions}
                          item={item}
                          getRowId={getRowId}
                        />

                      </TableCell>

                    )}

                  </TableRow>

                );

              })

            ) : (

              <TableRow>

                <TableCell
                  colSpan={
                    columns.length +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </div>

      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="grid md:hidden">

        {data.length > 0 ? (

          data.map((item) => {

            const id = String(item[getRowId]);

            return (

              <div
                key={id}
                onClick={() => handleRowClick(item)}
                className={`
                  border-b
                  border-[var(--color-secondary)]
                  p-4
                  ${
                    rowHref
                      ? "cursor-pointer"
                      : ""
                  }
                  transition-colors
                  hover:bg-[var(--color-secondary)]
                `}
              >

                {/* ================= TOP ================= */}

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    {columns
                      .slice(0, 2)
                      .map((column) => {

                        const value =
                          item[column.key];

                        return (

                          <p
                            key={String(column.key)}
                            className="truncate"
                          >

                            {column.href ? (

                              <Link
                                href={replaceId(
                                  column.href,
                                  id
                                )}
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                                className="
                                  font-medium
                                  hover:underline
                                "
                              >
                                {String(
                                  value ?? "-"
                                )}
                              </Link>

                            ) : (

                              String(value ?? "-")

                            )}

                          </p>

                        );

                      })}

                  </div>

                  {/* ACTIONS */}

                  {actions.length > 0 && (

                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >

                      <ActionsMenu
                        actions={actions}
                        item={item}
                        getRowId={getRowId}
                      />

                    </div>

                  )}

                </div>

                {/* ================= DETAILS ================= */}

                <div className="mt-4 grid grid-cols-2 gap-3">

                  {columns
                    .slice(2)
                    .map((column) => {

                      const value =
                        item[column.key];

                      return (

                        <div
                          key={String(column.key)}
                        >

                          <p className="
                            text-xs
                            text-muted-foreground
                          ">
                            {column.label}
                          </p>

                          <p className="
                            truncate
                            text-sm
                          ">

                            {column.href ? (

                              <Link
                                href={replaceId(
                                  column.href,
                                  id
                                )}
                                onClick={(event) => {
                                  event.stopPropagation();
                                }}
                                className="
                                  hover:underline
                                "
                              >
                                {String(
                                  value ?? "-"
                                )}
                              </Link>

                            ) : (

                              String(value ?? "-")

                            )}

                          </p>

                        </div>

                      );

                    })}

                </div>

              </div>

            );

          })

        ) : (

          <div className="
            p-6
            text-center
            text-muted-foreground
          ">
            Aucun résultat.
          </div>

        )}

      </div>

    </div>
  );
}

/* =========================================================
   ACTION MENU
========================================================= */

function ActionsMenu<T extends Record<string, unknown>>({
  actions,
  item,
  getRowId,
}: {
  actions: Action<T>[];
  item: T;
  getRowId: keyof T;
}) {

  const id = String(item[getRowId]);
  const router = useRouter()  

  return (

    <DropdownMenu>

      {/* =====================================================
          TRIGGER
      ===================================================== */}

   <DropdownMenuTrigger
      className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[var(--color-secondary)]"
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <MoreHorizontal className="h-4 w-4" />

      <span className="sr-only">
        Ouvrir le menu
      </span>
    </DropdownMenuTrigger>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <DropdownMenuContent
        align="end"
        className="
        flex
        flex-col
          m-2
          bg-[var(--color-primary)]
          p-2
        "
      >

        {actions.map((action, index) => {

          const Icon = action.icon
            ? actionIcons[action.icon]
            : null;

          const href = action.href
            ? replaceId(
                action.href,
                id
              )
            : undefined;

          return (

            <div key={action.label}>

              {/* ================= SEPARATOR ================= */}

              {index > 0 &&
                action.variant ===
                  "destructive" && (

                  <DropdownMenuSeparator />

                )}

              {/* ================= LINK ================= */}

              {href ? (

               <DropdownMenuItem
  variant={action.variant}
  className="
    flex
    cursor-pointer
    items-center
    gap-2
    hover:bg-[var(--color-secondary)]
    hover:text-[var(--color-primary)]
  "
  onClick={(event) => {
    event.stopPropagation()

    if (href) {
      router.push(href)
    }
  }}
>
  {Icon && (
    <Icon className="h-4 w-4" />
  )}

  <span>
    {action.label}
  </span>
</DropdownMenuItem>
              ) : (

                /* ================= NO LINK ================= */

                <DropdownMenuItem
                  variant={action.variant}
                  className="
                  flex
                    cursor-pointer
                    gap-2
                    hover:bg-[var(--color-secondary)]
                    hover:text-[var(--color-primary)]
                  "
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >

                  {Icon && (

                    <Icon className="h-4 w-4" />

                  )}

                  <span>
                    {action.label}
                  </span>

                </DropdownMenuItem>

              )}

            </div>

          );

        })}

      </DropdownMenuContent>

    </DropdownMenu>

  );
}

/* =========================================================
   HELPER
========================================================= */

function replaceId(
  url: string,
  id: string
): string {
  return url.replace("{id}", id);
}
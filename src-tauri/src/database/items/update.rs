use super::super::schema::*;
use super::super::Database;

impl Database {
    pub fn update_sort_orders(&self, items: Vec<UpdateSortOrderParams>) -> DbResult<()> {
        for item in items {
            self.update_sort_order(item.id, &item.sort_order)?;
        }
        Ok(())
    }
}
